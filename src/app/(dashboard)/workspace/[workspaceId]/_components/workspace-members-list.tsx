"use client"

import React from 'react'
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import Image from "next/image";
import {useSuspenseQuery} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {getAvatar} from "@/lib/get-avatar";

const WorkspaceMembersList = () => {
    const {data: {members}} = useSuspenseQuery(orpc.channel.list.queryOptions())
    return (
        <div className={'space-y-0.5 py-1'}>
            {members.map((member) => (
                <div
                    key={member.id}
                    className={"px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3"}
                >
                    <div className={"relative"}>
                        <Avatar className={"size-8 relative"}>
                            <Image
                                src={getAvatar(member.picture ?? null, member.email!)}
                                alt={"User Image"}
                                fill
                                className={"object-cover"}
                            />
                            <AvatarFallback>
                                {member.full_name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className={"flex-1 min-w-0"}>
                        <p className={"text-sm font-medium truncate"}>
                            {member.full_name}
                        </p>
                        <p className={"text-xs text-muted-foreground truncate"}>
                            {member.email}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default WorkspaceMembersList
