// proxy.ts
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(
    "sb-btghilnlxsqdpbqztqsg-auth-token",
  )?.value;
  // console.log(request.cookies.getAll());
  // console.log(token);
  // if (!token && !request.nextUrl.pathname.startsWith("/home")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  if (token && request.nextUrl.pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // if (token && request.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }

  return NextResponse.next();
}

// config도 여기 같이 있어야 함
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
