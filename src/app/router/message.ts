import {base} from "@/app/middlewares/base";
import {requiredAuthMiddleware} from "@/app/middlewares/auth";
import {requiredWorkspaceMiddleware} from "@/app/middlewares/workspace";
import {standardSecurityMiddleware} from "@/app/middlewares/arkjet/standard";
import {writeSecurityMiddleware} from "@/app/middlewares/arkjet/write";
import z from "zod";
import prisma from "@/lib/prisma";
import {createMessageSchema} from "@/schemas/message-schema";
import {getAvatar} from "@/lib/get-avatar";
import {Message} from "@/generated/prisma/client";
import {readSecurityMiddleware} from "@/app/middlewares/arkjet/read";

export const createMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(writeSecurityMiddleware)
    .route({
        method: "POST",
        path: "/messages",
        summary: "Create a new message",
        tags: ["messages"]
    })
    .input(createMessageSchema)
    .output(z.custom<Message>())
    .handler(async ({input, context, errors}) => {
        // verify channel belongs to the user's organization
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode
            }
        })
        if (!channel) {
            throw errors.FORBIDDEN()
        }

        const created = await prisma.message.create({
            data: {
                content: input.content,
                imageUrl: input.imageUrl,
                channelId: input.channelId,
                authorId: context.user.id,
                authorEmail: context.user.email!,
                authorName: context.user.given_name ?? context.user.email!.split("@")[0],
                authorAvatar: getAvatar(context.user.picture, context.user.email!),
            }
        })

        return {
            ...created
        }
    })

export const listMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(readSecurityMiddleware)
    .route({
        method: "GET",
        path: "/messages",
        summary: "List all message",
        tags: ["messages"]
    })
    .input(z.object({
        channelId: z.string()
    }))
    .output(z.array(z.custom<Message>()))
    .handler(async ({input, context, errors}) => {
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode
            }
        })
        if (!channel) {
            throw errors.FORBIDDEN()
        }

        const messages = await prisma.message.findMany({
            where: {
                authorId: context.user.id,
                channelId: input.channelId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return messages
    })