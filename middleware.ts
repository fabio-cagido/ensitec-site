import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/dashboard-restaurante(.*)',
  '/dashboard-corporativo(.*)',
  '/dashboard-hub(.*)'
]);

const isFinanceiroRoute = createRouteMatcher(['/dashboard/financeiro(.*)']);
const isAcademicoRoute = createRouteMatcher(['/dashboard/academico(.*)']);
const isClientesRoute = createRouteMatcher(['/dashboard/clientes(.*)']);
const isOperacionalRoute = createRouteMatcher(['/dashboard/operacional(.*)']);
const isEnemRoute = createRouteMatcher(['/dashboard/enem(.*)']);

type UserRole = 'admin' | 'manager' | 'financeiro' | 'academico' | 'secretaria';

function hasRequiredRole(userRole: string | undefined | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole as UserRole);
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

    const { sessionClaims, userId } = await auth();
    let userRole = (sessionClaims?.metadata as any)?.role;
    let userNiche = (sessionClaims?.metadata as any)?.nicho;

    if ((!userRole || !userNiche) && userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        userRole = userRole || user.publicMetadata?.role;
        userNiche = userNiche || user.publicMetadata?.nicho;
      } catch (error) {
        console.error("Clerk API Fetch Error nas Metadata:", error);
      }
    }

    // Processa os nichos
    const rawNicho = typeof userNiche === 'string' ? userNiche : (Array.isArray(userNiche) ? userNiche.join(',') : 'escola');
    const allowedNiches = rawNicho.split(',').map(n => n.trim().toLowerCase());
    const path = req.nextUrl.pathname;

    // Se tentar acessar o hub mas só tem um nicho (e não é admin), manda pro nicho específico
    if (path.startsWith('/dashboard-hub')) {
        const isAdmin = allowedNiches.includes('admin');
        if (!isAdmin && allowedNiches.length === 1) {
            if (allowedNiches.includes('restaurante')) return NextResponse.redirect(new URL('/dashboard-restaurante', req.url));
            if (allowedNiches.includes('corporativo')) return NextResponse.redirect(new URL('/dashboard-corporativo', req.url));
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
    }

    // PROTEÇÃO DE ROTAS POR NICHO
    if (path.startsWith('/dashboard-restaurante')) {
      if (!allowedNiches.includes('restaurante') && !allowedNiches.includes('admin')) {
          return NextResponse.redirect(new URL(allowedNiches.includes('escola') ? '/dashboard' : '/dashboard-hub', req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith('/dashboard-corporativo')) {
      if (!allowedNiches.includes('corporativo') && !allowedNiches.includes('admin')) {
          return NextResponse.redirect(new URL(allowedNiches.includes('escola') ? '/dashboard' : '/dashboard-hub', req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith('/dashboard-hub')) {
        return NextResponse.next(); // O hub lida com a lista interna de nichos permitidos
    }

    // ===================================
    // ESCOLA (Tudo que sobrou em /dashboard)
    // ===================================
    if (!allowedNiches.includes('escola') && !allowedNiches.includes('admin')) {
        return NextResponse.redirect(new URL('/dashboard-hub', req.url));
    }

    // Lógica Específica da Escola
    if (!userRole) {
      if (path !== '/dashboard' && !path.startsWith('/dashboard/acesso-negado')) {
        return NextResponse.redirect(new URL('/dashboard/acesso-negado', req.url));
      }
      return NextResponse.next();
    }

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
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};