import React from 'react'
import MessageItem
    from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/messageItem";

const messages = [
    {
        id: 1,
        message: "Banana",
        date: new Date(),
        avatar: "/woody_funny.jpg",
        userName: "Booty Buttcheeks"
    },
    {
        id: 2,
        message: "Generic message for data simulations",
        date: new Date(),
        avatar: "/woody_funny.jpg",
        userName: "Booty Buttcheeks"
    }
]

const MessageList = () => {
    return (
        <div className={"relative h-full"}>
            <div className={"h-full overflow-y-auto px-4"}>
                {messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        {...message}
                    />
                ))}
            </div>
        </div>
    )
}
export default MessageList
