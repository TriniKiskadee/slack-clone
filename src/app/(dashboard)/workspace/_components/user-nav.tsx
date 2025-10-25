"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {CreditCardIcon, LogOutIcon, UserIcon} from "lucide-react";
import {LogoutLink, PortalLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {useSuspenseQuery} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";
import {getAvatar} from "@/lib/get-avatar";
import {KindeUser} from "@kinde-oss/kinde-auth-nextjs";

const UserNav = () => {
    const {data: {user}} = useSuspenseQuery(orpc.workspace.list.queryOptions())

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    className={"size-12 rounded-xl hover:rounded-lg transition-all duration-200 bg-background/50 border-border/50 hover:bg-accent hover:text-accent-foreground"}
                >
                    <UserAvatar
                        isContent={false}
                        user={user}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={"end"}
                side={"right"}
                sideOffset={8}
                content={"w-[200px]"}
            >
                <DropdownMenuLabel className={"font-normal flex items-center gap-2 px-1 py-1.5 text-left text-sm"}>
                    <UserAvatar
                        isContent={false}
                        user={user}
                    />
                    <div className={"grid flex-1 text-left text-sm leading-tight"}>
                        <p className={"truncate"}>
                            {user.given_name}
                        </p>
                        <p className={"text-muted-foreground truncate text-xs"}>
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <PortalLink>
                            <UserIcon />
                            Account
                        </PortalLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <PortalLink>
                            <CreditCardIcon />
                            Billing
                        </PortalLink>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <LogoutLink>
                        <LogOutIcon />
                        Log out
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserNav;

const UserAvatar = ({isContent, user}: {isContent: boolean; user: KindeUser<Record<string, unknown>>}) => {
    return (
        <Avatar className={cn(isContent ? "relative size-8 rounded-lg" : "")}>
            <AvatarImage
                src={getAvatar(user.picture, user.email!)}
                alt={"User Image"}
                className={"object-cover"}
            />
            <AvatarFallback>
                {user.given_name!.slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}