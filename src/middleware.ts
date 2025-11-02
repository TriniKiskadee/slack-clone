import {createMiddleware, detectBot} from "@arcjet/next";
import arkjet from "@arcjet/next";
import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware"
import {NextMiddleware, NextRequest, NextResponse} from "next/server";

const aj = arkjet({
    key: process.env.ARKJET_KEY!,
    rules: [
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
                "CATEGORY:MONITOR",
                "CATEGORY:WEBHOOK"
            ]
        })
    ]
})

async function existingMiddleware(req: NextRequest) {
    const anyReq = req as {
        nextUrl: NextRequest["nextUrl"];
        kindeAuth?: {
            token?: any,
            user?: any
        }
    }
    const url = req.nextUrl
    const orgCode =
        anyReq.kindeAuth?.user?.org_code ||
        anyReq.kindeAuth?.token?.org_code ||
        anyReq.kindeAuth?.token?.claims?.org_code;

    if (url.pathname.startsWith("/workspace") && !url.pathname.includes(orgCode|| "")) {
        url.pathname = `/workspace/${orgCode}`

        return NextResponse.next()
    }
}

export default createMiddleware(
    aj,
    withAuth(existingMiddleware, {
        publicPaths: [
            "/",
            "/api/uploadthing"
        ]
    }) as NextMiddleware
)

export const config = {
    matcher: [
        // matcher tells Next.js which routes to run the middleware on.
        // This runs the middleware on all routes except for static assets.
        "/((?!_next/static|_next/image|favicon.ico|/rpc).*)"
    ]
}