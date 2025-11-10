import {base} from "@/app/middlewares/base";
import {requiredAuthMiddleware} from "@/app/middlewares/auth";
import {requiredWorkspaceMiddleware} from "@/app/middlewares/workspace";
import {standardSecurityMiddleware} from "@/app/middlewares/arkjet/standard";
import {heavyWriteSecurityMiddleware} from "@/app/middlewares/arkjet/heave-write";
import {inviteMemberSchema} from "@/schemas/member-schema";
import z from "zod";
import {init, organization_user, Organizations, Users} from "@kinde/management-api-js";
import {getAvatar} from "@/lib/get-avatar";
import prisma from "@/lib/prisma";
import {readSecurityMiddleware} from "@/app/middlewares/arkjet/read";

export const inviteMember = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(heavyWriteSecurityMiddleware)
    .route({
        method: "POST",
        path: "/workspace/members/invite",
        summary: "invite member",
        tags: ["Members"]
    })
    .input(inviteMemberSchema)
    .output(z.void())
    .handler(async ({input, context, errors}) => {
        try {
            init()
            await Users.createUser({
                requestBody: {
                    organization_code: context.workspace.orgCode,
                    profile: {
                        given_name: input.name,
                        picture: getAvatar(null, input.email),
                    },
                    identities: [
                        {
                            type: "email",
                            details: {
                                email: input.email,
                            },
                        }
                    ]
                }
            })
        } catch {
            throw errors.INTERNAL_SERVER_ERROR()
        }
    })

export const listMembers = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(readSecurityMiddleware)
    .route({
        method: "GET",
        path: "/workspace/members",
        summary: "List all member",
        tags: ["Members"]
    })
    .input(z.void())
    .output(z.array(z.custom<organization_user>()))
    .handler(async ({context, errors}) => {
        try {
            init()

            const data = await Organizations.getOrganizationUsers({
                orgCode: context.workspace.orgCode,
                sort: "name_asc"
            })
            if (!data.organization_users) {
                throw errors.NOT_FOUND()
            }

            return data.organization_users
        } catch {
            throw errors.INTERNAL_SERVER_ERROR()
        }
    })