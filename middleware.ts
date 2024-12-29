import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.redirect(new URL("/api/auth/signin", req.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
