// proxy.ts
import { type NextRequest, NextResponse } from "next/server";

// export async function proxy(request: NextRequest) {
//   const token = request.cookies.get(
//     "sb-btghilnlxsqdpbqztqsg-auth-token",
//   )?.value;
//   // console.log(request.cookies.getAll());
//   // console.log(token);
//   // if (!token && !request.nextUrl.pathname.startsWith("/home")) {
//   //   return NextResponse.redirect(new URL("/login", request.url));
//   // }

//   if (token && request.nextUrl.pathname.startsWith("/register")) {
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   // if (token && request.nextUrl.pathname.startsWith("/login")) {
//   //   return NextResponse.redirect(new URL("/home", request.url));
//   // }

//   return NextResponse.next();
// }

// proxy.ts - 토큰 여부만 판단
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(
    "sb-btghilnlxsqdpbqztqsg-auth-token",
  )?.value;

  // 비로그인 → 로그인 페이지로
  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/register")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 로그인 상태 → 로그인/회원가입 페이지 접근 차단
  if (
    token &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// config도 여기 같이 있어야 함
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
