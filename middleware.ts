import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se a rota for exatamente /produtos/novo, redirecionamos para a página correta
  if (pathname === "/produtos/novo") {
    return NextResponse.redirect(new URL("/produtos/novo-produto", request.url))
  }

  return NextResponse.next()
}

// Configurar o middleware para ser executado apenas nas rotas específicas
export const config = {
  matcher: ["/produtos/novo"],
}
