"use client"

import {useSuspenseQuery} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";

type Props = {};

const WorkspaceHeader = (props: Props) => {
    const {data: {currentWorkspace}} = useSuspenseQuery(orpc.channel.list.queryOptions())
    return (
        <h2 className={"text-lg font-semibold"}>
            {currentWorkspace.orgName}
        </h2>
    );
};
export default WorkspaceHeader;
