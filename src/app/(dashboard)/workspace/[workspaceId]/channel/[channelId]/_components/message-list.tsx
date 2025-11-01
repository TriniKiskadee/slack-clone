"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import MessageItem from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/messageItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const MessageList = () => {
    const [hasInitialScrolled, setHasInitialScrolled] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { channelId } = useParams<{ channelId: string }>();

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
    };

    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.items) ?? [];
    }, [data]);

    useEffect(() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                el.scrollTop = el.scrollHeight;
                setHasInitialScrolled(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);

    return (
        <div className={"relative h-full"}>
            <div className={"h-full overflow-y-auto px-4"} ref={scrollRef} onScroll={handleScroll}>
                {items?.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))}
                {isFetching && !isFetchingNextPage ? (
                    <div className={"py-2 text-center text-sm text-muted-foreground"}>
                        Fetching...
                        <div className={"flex items-center space-x-4"}>
                            <Skeleton className={"h-12 w-12 rounded-full"} />
                            <div className={"space-y-2"}>
                                <Skeleton className={"w-full h-[300px]"} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
export default MessageList;
