// ไว้รัน ,middleware
import { NextRequest } from "next/server";
// import { authMiddleware } from "./middlewares/auth.middleware";

export async function proxy(req: NextRequest) {
  //   return authMiddleware(req);
}

// export const config = {
//   matcher: ["/dashboard/:path*", "/petsitter/:path*","/admin/:path*"],
// };
