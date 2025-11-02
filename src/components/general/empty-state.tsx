import React from 'react'
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {LucideIcon, PlusCircleIcon} from "lucide-react";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import CreateNewChannel from "@/app/(dashboard)/workspace/[workspaceId]/_components/create-new-channel";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    customButton?: () => React.ReactNode;
    buttonText: string;
    href?: string;
}

const EmptyState = ({title, description, icon: Icon, buttonText, href, customButton: CustomButton}: EmptyStateProps) => {
    return (
        <Empty className={"border border-dashed from-muted/50 to-background h-full bg-gradient-to-b from-30%"}>
            <EmptyHeader>
                <EmptyMedia
                    variant={"icon"}
                    className={"bg-primary/10"}
                >
                    <Icon className={"size-4 text-primary"}/>
                </EmptyMedia>
                <EmptyTitle>
                    {title}
                </EmptyTitle>
                <EmptyDescription>
                    {description}
                </EmptyDescription>
            </EmptyHeader>
            {!CustomButton ? (
                <EmptyContent>
                    <Link
                        href={href || "#"}
                        className={buttonVariants({
                            variant: "secondary"
                        })}
                    >
                        <PlusCircleIcon/>
                        {buttonText}
                    </Link>
                </EmptyContent>
            ) : (
                <EmptyContent className={"max-w-xs mx-auto"}>
                    <CustomButton />
                </EmptyContent>
            )}

        </Empty>
    )
}
export default EmptyState
