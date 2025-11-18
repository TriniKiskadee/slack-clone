import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, MessageSquareIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDateWithOrdinal } from "@/lib/utils";
import ThreadReply from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/thread/thread-reply";
import ThreadReplyForm from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/thread/thread-reply-form";
import { useThread } from "@/providers/thread-provider";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { getAvatar } from "@/lib/get-avatar";
import SafeContent from "@/components/rich-text-editor/safe-content";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import ThreadSidebarSkeleton from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/thread/thread-sidebar-skeleton";

interface ThreadSidebarProps {
    user: KindeUser<Record<string, unknown>>;
}

const ThreadSidebar = ({ user }: ThreadSidebarProps) => {
    const { selectedThreadId, closeThread } = useThread();

    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastMessageCountRef = useRef(0);

    const { data: thread, isLoading } = useQuery(
        orpc.message.thread.list.queryOptions({
            input: {
                messageId: selectedThreadId!,
            },
            enabled: Boolean(selectedThreadId),
        }),
    );

    const messageCount = thread?.messages.length ?? 0;

    const isNearBottom = (el: HTMLDivElement) =>
        el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        setIsAtBottom(isNearBottom(el));
    };

    // Enables auto scroll when new message are sent/received
    useEffect(() => {
        if (messageCount === 0) return;

        const prevMessageCount = lastMessageCountRef.current;
        const el = scrollRef.current;

        if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
            if (el && isNearBottom(el)) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({
                        block: "end",
                        behavior: "smooth",
                    });
                });
                setIsAtBottom(true);
            }
        }

        lastMessageCountRef.current = messageCount;
    }, [messageCount]);

    // Keep view pinned to bottom on late content growth (e.g. images)
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const scrollToBottomIfNeeded = () => {
            if (isAtBottom) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({ block: "end" });
                });
            }
        };

        const onImageLoad = (e: Event) => {
            if (e.target instanceof HTMLImageElement) {
                scrollToBottomIfNeeded();
            }
        };

        el.addEventListener("load", onImageLoad, true);

        // ResizeObserver watches for size changes in the container
        const resizeObserver = new ResizeObserver(() => {
            scrollToBottomIfNeeded();
        });

        resizeObserver.observe(el);

        // MutationObserver watched for DOM changes (e.g. images loading, content updates)
        const mutationObserver = new MutationObserver(() => {
            scrollToBottomIfNeeded();
        });

        mutationObserver.observe(el, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        return () => {
            resizeObserver.disconnect();
            el.removeEventListener("load", onImageLoad, true);
            mutationObserver.disconnect();
        };
    }, [isAtBottom]);

    const scrollToBottom = () => {
        const el = scrollRef.current;
        if (!el) return;

        bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

        setIsAtBottom(true);
    };

    if (isLoading) {
        return <ThreadSidebarSkeleton />;
    }

    return (
        <div className={"w-[30rem] border-l flex flex-col h-full"}>
            {/* Header */}
            <div
                className={
                    "border-b h-14 px-4 flex items-center justify-between"
                }
            >
                <div className={"flex items-center gap-2"}>
                    <MessageSquareIcon className={"size-4"} />
                    <span>Thread</span>
                </div>
                <div className={"flex items-center gap-2"}>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={closeThread}
                    >
                        <XIcon className={"size-4"} />
                    </Button>
                </div>
            </div>

            {/* Body */}
            <div className={"relative flex-1 overflow-y-auto"}>
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className={"h-full overflow-auto"}
                >
                    {thread && (
                        <>
                            <div className={"p-4 border-b bg-muted/20"}>
                                <div className={"flex space-x-3"}>
                                    <Image
                                        src={getAvatar(
                                            thread.parent.authorAvatar,
                                            thread.parent.authorEmail,
                                        )}
                                        alt={"Author message"}
                                        width={32}
                                        height={32}
                                        className={
                                            "size-8 rounded-full shrink-0"
                                        }
                                    />
                                    <div className={"flex-1 space-y-1 min-w-0"}>
                                        <div
                                            className={
                                                "flex items-center space-x-2"
                                            }
                                        >
                                            <span
                                                className={
                                                    "font-medium text-sm"
                                                }
                                            >
                                                {thread.parent.authorName}
                                            </span>
                                            <span
                                                className={
                                                    "text-xs text-muted-foreground"
                                                }
                                            >
                                                {formatDateWithOrdinal(
                                                    thread.parent.createdAt,
                                                )}
                                            </span>
                                        </div>

                                        <SafeContent
                                            content={JSON.parse(
                                                thread.parent.content,
                                            )}
                                            className={
                                                "text-sm break-words prose dark:prose-invert max-w-none marker:text-primary"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thread Replies */}
                            <div className={"p-2"}>
                                <p
                                    className={
                                        "text-xs text-muted-foreground mb-3 px-2"
                                    }
                                >
                                    {thread.messages.length} replies
                                </p>
                                <div className={"space-y-1"}>
                                    {thread.messages.map((reply) => (
                                        <ThreadReply
                                            key={reply.id}
                                            message={reply}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div ref={bottomRef}></div>
                        </>
                    )}
                </div>
                {/* Scroll to bottom button */}
                {!isAtBottom && (
                    <Button
                        type={"button"}
                        onClick={scrollToBottom}
                        size={"sm"}
                        className={
                            "absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200"
                        }
                    >
                        <ChevronDownIcon />
                    </Button>
                )}
            </div>

            {/* Thread reply form */}
            <div className={"border-t p-4"}>
                <ThreadReplyForm threadId={selectedThreadId!} user={user} />
            </div>
        </div>
    );
};
export default ThreadSidebar;
