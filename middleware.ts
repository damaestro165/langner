import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server"; // 👈 Import NextRequest

export default withAuth(
  async function middleware(req: NextRequest) { // 👈 Add type annotation
    // Your middleware logic
  },
  {
    publicPaths: ["/"],
  }
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};