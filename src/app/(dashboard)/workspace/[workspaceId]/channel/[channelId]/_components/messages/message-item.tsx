import React from "react";
import Image from "next/image";
import { formatDateWithOrdinal } from "@/lib/utils";
import { Message } from "@/generated/prisma/client";
import { getAvatar } from "@/lib/get-avatar";
import SafeContent from "@/components/rich-text-editor/safe-content";

interface MessageItemProps {
    message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
    return (
        <div className={"flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50"}>
            <Image
                src={getAvatar(message.authorAvatar, message.authorEmail)}
                alt={"User Image"}
                width={32}
                height={32}
                className={"size-8 rounded-xl"}
            />
            <div className={"flex-1 space-y-1 min-w-0"}>
                <div className={"flex items-center gap-x-2"}>
                    <p className={"font-medium leading-none"}>{message.authorName}</p>
                    <p className={"text-xs text-muted-foreground leading-none"}>
                        {/*{new Intl.DateTimeFormat("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        }).format(date)}
                        {" "}
                        {new Intl.DateTimeFormat("en-US", {
                            hour12: true,
                            hour: "2-digit",
                            minute: "2-digit",
                        }).format(date)}*/}
                        {formatDateWithOrdinal(message.createdAt)}
                    </p>
                </div>

                {/* Message */}
                <SafeContent
                    content={
                        message.content ? JSON.parse(message.content) : { type: "doc", content: [] }
                    }
                    className={
                        "text-sm break-words prose dark:prose-invert max-w-none mark:text-primary"
                    }
                />

                {message.imageUrl && (
                    <div className={"mt-3"}>
                        <Image
                            src={message.imageUrl}
                            alt={"Message attachment"}
                            width={512}
                            height={512}
                            className={"rounded-md max-h-[320px] w-auto object-contain"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default MessageItem;
