import arcjet, {slidingWindow} from "@/lib/arkjet";
import {base} from "@/app/middlewares/base";
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs";

const buildStandardAj = () =>
    arcjet.withRule(
        slidingWindow({
            mode: "LIVE",
            interval: "1m",
            max: 40,
        })
    )

export const writeSecurityMiddleware = base
    .$context<{
        request: Request;
        user: KindeUser<Record<string, unknown>>
    }>()
    .middleware(async ({context, next, errors}) => {
        const decision = await buildStandardAj().protect(context.request, {
            userId: context.user.id,
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                throw errors.RATE_LIMITED({
                    message: "Too may impactful changes. Please slow down."
                })
            }

            throw errors.FORBIDDEN({
                message: "Request blocked!"
            })
        }

        return next()
    })