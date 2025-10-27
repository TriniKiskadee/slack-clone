import React from 'react'
import ChannelHeader from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/channel-header";
import MessageList from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/message-list";
import MessageInputForm
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-input-form";

const ChannelMainPage = () => {
    return (
        <div className={"flex h-screen w-full"}>
            {/* Main channel area*/}
            <div className={"flex flex-col flex-1 min-w-0"}>
                {/* Channel header */}
                <ChannelHeader />

                {/* Scrollable messages area */}
                <div className={"flex-1 overflow-hidden mb-4"}>
                    <MessageList />
                </div>

                {/* Message Input*/}
                <div className={"border-t bg-background p-4"}>
                    <MessageInputForm />
                </div>
            </div>
        </div>
    )
}
export default ChannelMainPage
