"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import MessageItem from "@/app/(dashboard)/workspace/[workspaceId]/channel/[channelId]/_components/messages/message-item";
import {useInfiniteQuery, useSuspenseQuery} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/general/empty-state";
import {ChevronDownIcon, Loader2, MessageCircleIcon} from "lucide-react";

const MessageList = () => {
    const [hasInitialScrolled, setHasInitialScrolled] = useState<boolean>(false);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const lastItemIdRef = useRef<string | undefined>(undefined);

    const { channelId } = useParams<{ channelId: string }>();

    const isNearBottom = (el: HTMLDivElement) =>
        el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const infiniteOptions = orpc.message.list.infiniteOptions({
        input: (pageParam: string | undefined) => ({
            channelId: channelId,
            cursor: pageParam,
            limit: 10,
        }),
        queryKey: ["message.list", channelId],
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
            ...infiniteOptions,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        });

    const {data: {user}} = useSuspenseQuery(orpc.workspace.list.queryOptions())

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
            const prevScrollHeight = el.scrollHeight;
            const prevScrollTop = el.scrollTop;

            fetchNextPage().then(() => {
                const newScrollHeight = el.scrollHeight;

                el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
            });
        }
        setIsAtBottom(isNearBottom(el));
    };

    const items = useMemo(() => {
        return data?.pages.flatMap((p) => p.items) ?? [];
    }, [data]);

    const isEmpty = !isLoading && !error && items.length === 0;

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

                setIsAtBottom(true);
            }
        }

        lastItemIdRef.current = lastId;
    }, [items]);

    /* Scroll to the bottom when messages first load*/
    useEffect(() => {
        if (!hasInitialScrolled && data?.pages.length) {
            const el = scrollRef.current;

            if (el) {
                bottomRef.current?.scrollIntoView({block: "end"})
                setHasInitialScrolled(true);
                setIsAtBottom(true);
            }
        }
    }, [hasInitialScrolled, data?.pages.length]);

    const scrollToBottom = () => {
        const el = scrollRef.current;
        if (!el) return;

        bottomRef.current?.scrollIntoView({block: "end"})

        setIsAtBottom(true);
    };

    // Keep view pinned to bottom on late content growth (e.g. images)
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const scrollToBottomIfNeeded = () => {
            if(isAtBottom || !hasInitialScrolled) {
                requestAnimationFrame(() => {
                    bottomRef.current?.scrollIntoView({block: "end"})
                })
            }
        }

        const onImageLoad = (e: Event) => {
            if (e.target instanceof HTMLImageElement) {
                scrollToBottomIfNeeded()
            }
        }

        el.addEventListener("load", onImageLoad, true)

        // ResizeObserver watches for size changes in the container
        const resizeObserver = new ResizeObserver(() => {
            scrollToBottomIfNeeded()
        })

        resizeObserver.observe(el)

        // MutationObserver watched for DOM changes (e.g. images loading, content updates)
        const mutationObserver = new MutationObserver(() => {
            scrollToBottomIfNeeded()
        })

        mutationObserver.observe(el, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        })

        return () => {
            resizeObserver.disconnect();
            el.removeEventListener("load", onImageLoad, true);
            mutationObserver.disconnect();
        }
    }, [isAtBottom, hasInitialScrolled]);

    return (
        <div className={"relative h-full"}>
            <div
                className={"h-full overflow-y-auto px-4 flex flex-col space-y-1"}
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {isEmpty ? (
                    <div className={"flex h-full pt-4"}>
                        <EmptyState
                            icon={MessageCircleIcon}
                            title={"It's empty in here!"}
                            description={"Start your first conversation to begin"}
                            buttonText={"Send a message"}
                            href={"#"}
                        />
                    </div>
                ) : (
                    items.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            currentUserId={user.id}
                        />
                    ))
                )}

                <div ref={bottomRef} />

                {!isEmpty && isFetching && !isFetchingNextPage ? (
                    <div className={"py-2 text-center text-sm text-muted-foreground"}>
                        {/*Fetching...*/}
                        {Array.from({ length: 9 }).map((_, index) => (
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

            {isFetchingNextPage && (
                <div className={"pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2"}>
                    <div className={"flex items-center gap-2 rounded-md bg-gradient-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1"}>
                        <Loader2 className={"size-4 animate-spin text-muted-foreground"}/>
                        <span>
                            Loading...
                        </span>
                    </div>
                </div>
            )}

            {!isAtBottom && (
                <Button
                    type={"button"}
                    onClick={scrollToBottom}
                    size={"sm"}
                    className={"absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200"}
                >
                    <ChevronDownIcon />
                </Button>
            )}
        </div>
    );
};
export default MessageList;
