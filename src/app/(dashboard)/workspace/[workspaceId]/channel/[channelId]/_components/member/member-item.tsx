import React from 'react'
import {organization_user} from "@kinde/management-api-js";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import Image from "next/image";
import {getAvatar} from "@/lib/get-avatar";

interface MemberItemProps {
    member: organization_user
}

const MemberItem = ({member}: MemberItemProps) => {
    return (
        <div className={"px-3 py-2 hover:bg-accent cursor-pointer transition-colors"}>
            <div className={"flex items-center space-x-3"}>
                <div className={"relative"}>
                    <Avatar className={"size-8"}>
                        <Image
                            src={getAvatar(member.picture ?? null, member.email!)}
                            alt={"Member Avatar"}
                            fill
                            className={"object-cover"}
                        />
                        <AvatarFallback>
                            {member.full_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                {/* Member Info */}
                <div className={"flex-1 min-w-0"}>
                    <div className={"flex items-center justify-between"}>
                        <p className={"text-xm font-medium truncate"}>
                            {member.full_name}
                        </p>
                        <span className={"inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-400/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-700/10 dark:ring-green-400/30"}>
                            Admin
                        </span>
                    </div>
                    <p className={"text-xs text-muted-foreground truncate"}>
                        {member.email}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default MemberItem
