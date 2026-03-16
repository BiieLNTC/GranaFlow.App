import { NextRequest, NextResponse } from 'next/server';

// Rotas públicas que não requerem autenticação
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Se o usuário está em rota pública mas já tem token, redireciona para dashboard
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se o usuário não tem token e não está em rota pública, redireciona para login
  if (!publicRoutes.includes(pathname) && !token && pathname !== '/') {
    // Verificar se é uma rota do dashboard que requer autenticação
    if (pathname.startsWith('/transactions') || 
        pathname.startsWith('/categories') || 
        pathname.startsWith('/people') ||
        pathname.startsWith('/settings')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configurar rotas para o middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
