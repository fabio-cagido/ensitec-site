import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// ============================================
// ROUTE MATCHERS
// ============================================
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

const isFinanceiroRoute = createRouteMatcher(['/dashboard/financeiro(.*)']);
const isAcademicoRoute = createRouteMatcher(['/dashboard/academico(.*)']);
const isClientesRoute = createRouteMatcher(['/dashboard/clientes(.*)']);
const isOperacionalRoute = createRouteMatcher(['/dashboard/operacional(.*)']);
const isEnemRoute = createRouteMatcher(['/dashboard/enem(.*)']);

// ============================================
// ROLE DEFINITIONS (Escada de Permissões via Metadata)
// ============================================
// admin     → Tudo + Gestão de Organização
// manager   → Todos os Dashboards (sem gestão org)
// financeiro→ Visão Geral, Financeiro, Operacional
// academico → Visão Geral, Acadêmico, Clientes, Enem
// secretaria→ Visão Geral, Clientes
// ============================================

type UserRole = 'admin' | 'manager' | 'financeiro' | 'academico' | 'secretaria';

function hasRequiredRole(userRole: string | undefined | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
}

export default clerkMiddleware(async (auth, req) => {
  // 1. Proteger todas as rotas /dashboard — requer autenticação
  if (isProtectedRoute(req)) {
    await auth.protect();

    // 2. Obter a role do utilizador
    const { sessionClaims, userId } = await auth();
    let userRole = (sessionClaims?.metadata as any)?.role;

    // Se o JWT não estiver configurado para incluir publicMetadata, fazemos o fetch direto à API do Clerk
    if (!userRole && userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        userRole = user.publicMetadata?.role;
      } catch (error) {
        console.error("Clerk API Fetch Error nas Metadata:", error);
      }
    }

    // Se não tem role definida, permite acesso apenas à Visão Geral e acesso-negado
    if (!userRole) {
      const path = req.nextUrl.pathname;
      if (path !== '/dashboard' && !path.startsWith('/dashboard/acesso-negado')) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
      return NextResponse.next();
    }

    // 3. Verificar permissões baseadas em role para rotas específicas
    if (isFinanceiroRoute(req)) {
      if (!hasRequiredRole(userRole, ['admin', 'manager', 'financeiro'])) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
    }

    if (isAcademicoRoute(req)) {
      if (!hasRequiredRole(userRole, ['admin', 'manager', 'academico'])) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
    }

    if (isClientesRoute(req)) {
      if (!hasRequiredRole(userRole, ['admin', 'manager', 'academico', 'secretaria'])) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
    }

    if (isOperacionalRoute(req)) {
      if (!hasRequiredRole(userRole, ['admin', 'manager', 'financeiro'])) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
    }

    if (isEnemRoute(req)) {
      if (!hasRequiredRole(userRole, ['admin', 'manager', 'academico'])) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};