import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn');

  // Se tentar acessar o dashboard sem o cookie, redireciona
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se estiver logado ou acessando outra página, permite continuar
  return NextResponse.next();
}

// Isso impede que o middleware rode em arquivos de imagem ou scripts
export const config = {
  matcher: ['/dashboard/:path*'],
};