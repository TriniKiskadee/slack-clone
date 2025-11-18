import React, { PropsWithChildren } from "react";
import WorkspaceHeader from "@/app/(dashboard)/workspace/[workspaceId]/_components/workspace-header";
import CreateNewChannel from "@/app/(dashboard)/workspace/[workspaceId]/_components/create-new-channel";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon, GitPullRequestDraft, LucideGitPullRequestDraft } from "lucide-react";
import ChannelList from "@/app/(dashboard)/workspace/[workspaceId]/_components/channel-list";
import WorkspaceMembersList from "@/app/(dashboard)/workspace/[workspaceId]/_components/workspace-members-list";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";

const ChannelListLayout = async ({ children }: PropsWithChildren) => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(orpc.channel.list.queryOptions());

    return (
        <>
            <div
                className={
                    "flex h-full w-80 flex-col bg-secondary border-r border-border"
                }
            >
                {/* Header */}
                <div
                    className={
                        "flex items-center px-4 h-14 border-b border-border"
                    }
                >
                    <HydrateClient client={queryClient}>
                        <WorkspaceHeader />
                    </HydrateClient>
                </div>

                <div className={"px-4 py-2"}>
                    <CreateNewChannel />
                </div>

                {/* Channel List */}
                <div className={"flex-1 overflow-y-auto px-4"}>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger
                            className={
                                "flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180"
                            }
                        >
                            <p>Main</p>
                            <ChevronDownIcon
                                className={
                                    "size-4 transition-transform duration-200"
                                }
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <HydrateClient client={queryClient}>
                                <ChannelList />
                            </HydrateClient>
                        </CollapsibleContent>
                    </Collapsible>
                </div>

                {/* Members List */}
                <div className={"px-4 py-2 border-t border-border"}>
                    <Collapsible defaultOpen>
                        <CollapsibleTrigger
                            className={
                                "flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180"
                            }
                        >
                            <p>Members</p>
                            <ChevronUpIcon
                                className={
                                    "size-4 transition-transform duration-200"
                                }
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <HydrateClient client={queryClient}>
                                <WorkspaceMembersList />
                            </HydrateClient>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
            {children}
        </>
    );
};
export default ChannelListLayout;