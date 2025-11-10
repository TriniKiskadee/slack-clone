import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "@/app/middlewares/auth";
import { requiredWorkspaceMiddleware } from "@/app/middlewares/workspace";
import { standardSecurityMiddleware } from "@/app/middlewares/arkjet/standard";
import { writeSecurityMiddleware } from "@/app/middlewares/arkjet/write";
import z from "zod";
import prisma from "@/lib/prisma";
import {createMessageSchema, updateMessageSchema} from "@/schemas/message-schema";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/generated/prisma/client";
import { readSecurityMiddleware } from "@/app/middlewares/arkjet/read";

export const createMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(writeSecurityMiddleware)
    .route({
        method: "POST",
        path: "/messages",
        summary: "Create a new message",
        tags: ["messages"],
    })
    .input(createMessageSchema)
    .output(z.custom<Message>())
    .handler(async ({ input, context, errors }) => {
        // verify channel belongs to the user's organization
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode,
            },
        });
        if (!channel) {
            throw errors.FORBIDDEN();
        }

        const created = await prisma.message.create({
            data: {
                content: input.content,
                imageUrl: input.imageUrl,
                channelId: input.channelId,
                authorId: context.user.id,
                authorEmail: context.user.email!,
                authorName:
                    context.user.given_name ??
                    context.user.email!.split("@")[0],
                authorAvatar: getAvatar(
                    context.user.picture,
                    context.user.email!,
                ),
            },
        });

        return {
            ...created,
        };
    });

export const listMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(readSecurityMiddleware)
    .route({
        method: "GET",
        path: "/messages",
        summary: "List all message",
        tags: ["messages"],
    })
    .input(
        z.object({
            channelId: z.string(),
            limit: z.number().min(1).max(100).optional(),
            cursor: z.string().optional(),
        }),
    )
    .output(
        z.object({
            items: z.array(z.custom<Message>()),
            nextCursor: z.string().optional(),
        }),
    )
    .handler(async ({ input, context, errors }) => {
        const channel = await prisma.channel.findFirst({
            where: {
                id: input.channelId,
                workspaceId: context.workspace.orgCode,
            },
        });
        if (!channel) {
            throw errors.FORBIDDEN();
        }

        const limit = input.limit ?? 30;

        const messages = await prisma.message.findMany({
            where: {
                channelId: input.channelId,
            },
            ...(input.cursor
                ? {
                      cursor: {
                          id: input.cursor,
                      },
                      skip: 1,
                  }
                : {}),
            take: limit,
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    id: "desc",
                },
            ],
        });

        const nextCursor =
            messages.length === limit
                ? messages[messages.length - 1].id
                : undefined;

        return {
            items: messages,
            nextCursor,
        };
    });

export const updateMessage = base
    .use(requiredAuthMiddleware)
    .use(requiredWorkspaceMiddleware)
    .use(standardSecurityMiddleware)
    .use(writeSecurityMiddleware)
    .route({
        method: "PUT",
        path: "/messages/:messageId",
        summary: "Update a new message",
        tags: ["messages"],
    })
    .input(updateMessageSchema)
    .output(z.object({
        message: z.custom<Message>(),
        canEdit: z.boolean(),
    }))
    .handler(async ({ input, context, errors }) => {
        // verify channel belongs to the user's organization
        const message = await prisma.message.findFirst({
            where: {
                id: input.messageId,
                Channel: {
                    workspaceId: context.workspace.orgCode,
                },
            },
            select: {
                id: true,
                authorId: true
            }
        });

        if (!message) {
            throw errors.NOT_FOUND();
        }

        if (message.authorId !== context.user.id) {
            throw errors.FORBIDDEN()
        }

        const updated = await prisma.message.update({
            where: {
                id: input.messageId
            },
            data: {
                content: input.content
            }
        })

        return {
            message: updated,
            canEdit: updated.authorId === context.user.id
        }
    });
