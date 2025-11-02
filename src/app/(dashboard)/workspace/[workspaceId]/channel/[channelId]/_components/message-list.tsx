"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import MessageItem from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-item";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { trackSynchronousRequestDataAccessInDev } from "next/dist/server/app-render/dynamic-rendering";
import { Button } from "@/components/ui/button";

const MessageList = () => {
    const [hasInitialScrolled, setHasInitialScrolled] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<boolean>(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastItemIdRef = useRef<string | undefined>(undefined);

    const { channelId } = useParams<{ channelId: string }>();

    const isNearBottom = (el: HTMLDivElement) =>
        el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const infinitOptions = orpc.message.list.infiniteOptions({
        input: (pageParam: string | undefined) => ({
            channelId: channelId,
            cursor: pageParam,
            limit: 30,
        }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        select: (messages) => ({
            pages: [...messages.pages]
                .map((p) => ({ ...p, items: [...p.items].reverse() }))
                .reverse(),
            pageParams: [...messages.pageParams].reverse(),
        }),
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isLoading, error } =
        useInfiniteQuery({
            ...infinitOptions,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        });

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
            const prevScrollHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            fetchNextPage().then(() => {
                const newScrollHeight = el.scrollHeight;

                el.scrollTop = el.scrollHeight - prevScrollHeight + prevScrollTop;
            });
        }
        setIsAtBottom(isNearBottom(el));
    };

    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.items) ?? [];
    }, [data]);

    useEffect(() => {
        if (!items.length) return;

        const lastId = items[items.length - 1].id;
        const prevLastId = lastItemIdRef.current;
        const el = scrollRef.current;

        if (prevLastId && lastId !== prevLastId) {
            if (el && isNearBottom(el)) {
                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight;
                });

                setNewMessage(false);
                setIsAtBottom(true);
            } else {
                setNewMessage(true);
            }
        }

        lastItemIdRef.current = lastId;
    }, [items]);

    useEffect(() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                el.scrollTop = el.scrollHeight;
                setHasInitialScrolled(true);
                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);

    const scrollToBottom = () => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight;
        setNewMessage(false);
        setIsAtBottom(true);
    };

    return (
        <div className={"relative h-full"}>
            <div
                className={"h-full overflow-y-auto px-4 flex flex-col space-y-1"}
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {items?.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))}

                <div ref={bottomRef} />
                {isFetching && !isFetchingNextPage ? (
                    <div className={"py-2 text-center text-sm text-muted-foreground"}>
                        {/*Fetching...*/}
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className={"flex items-center space-x-4 gap-3 mt-10"}>
                                <Skeleton className={"h-12 w-12 rounded-full"} />
                                <div className={"translate-y-[16px]"}>
                                    <div className="flex flex-row space-y-2 translate-[-18px] gap-1.5">
                                        <Skeleton className={"w-[46.58px] h-[16px]"} />
                                        <Skeleton className={"w-[139.16px] h-[12px]"} />
                                    </div>
                                    <Skeleton
                                        className={
                                            "w-[857.61px] h-[20px] translate-y-[-16px] translate-x-[-16px]"
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            {newMessage && !isAtBottom ? (
                <Button
                    type={"button"}
                    className={"absolute bottom-4 right-8 rounded-full"}
                    onClick={scrollToBottom}
                >
                    New Messages
                </Button>
            ) : null}
        </div>
    );
};
export default MessageList;
