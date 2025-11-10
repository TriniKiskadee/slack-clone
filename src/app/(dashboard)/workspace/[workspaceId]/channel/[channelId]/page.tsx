"use client"

import React from 'react'
import ChannelHeader from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/channel-header";
import MessageList from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/message-list";
import MessageInputForm
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-input-form";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs";
import {Skeleton} from "@/components/ui/skeleton";

const ChannelMainPage = () => {
    const {channelId} = useParams<{channelId: string}>()

    const {data, error, isLoading} = useQuery(
        orpc.channel.get.queryOptions({
            input: {channelId: channelId},
        })
    )

    if (error) {
        return (
            <p>
                Error: {error.message}
            </p>
        )
    }

    return (
        <div className={"flex h-screen w-full"}>
            {/* Main channel area*/}
            <div className={"flex flex-col flex-1 min-w-0"}>
                {/* Channel header */}
                {isLoading ? (
                    <div className={"flex items-center justify-between h-14 px-4 border-b"}>
                        <Skeleton className={"h-6 w-40"} />
                        <div className={"flex items-center space-x-2"}>
                            <Skeleton className={"h-8 w-[108px]"} />
                            <Skeleton className={"h-8 w-[138px]"} />
                            <Skeleton className={"size-8"} />
                        </div>
                    </div>
                ) : (
                    <ChannelHeader channelName={data?.channelName} />
                )}

                {/* Scrollable messages area */}
                <div className={"flex-1 overflow-hidden mb-4"}>
                    <MessageList />
                </div>

                {/* Message Input*/}
                <div className={"border-t bg-background p-4"}>
                    <MessageInputForm
                        channelId={channelId}
                        user={data?.currentUser as KindeUser<Record<string, unknown>>}
                    />
                </div>
            </div>
        </div>
    )
}
export default ChannelMainPage
