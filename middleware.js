// import { NextResponse } from "next/server";

// export function middleware(request) {
//   console.log(request);

// Note: If we don't specify "matcher", redeirect run into an infinite loop.
//   return NextResponse.redirect(new URL("/about", request.url));
// }

// Note: We are goign to use the "middleware" that actually comes from "nextAuth".
// Note: "auth" function from "NextAuth" actually serves as a middleware.
import { auth } from "@/app/_lib/auth";
export const middleware = auth;

// Note: We can tell middleware on which routes it shuold run.
export const config = {
  matcher: ["/account"],
};

// Note: We need to add "callbacks" to "authConfig" to check "authorization" for each incoming request to "/account"
