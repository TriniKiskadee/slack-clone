import React from "react";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";
import {Loader2} from "lucide-react";

const DashboardPage = async () => {
    const {getOrganization} = getKindeServerSession()
    const organization = await getOrganization();
    if (!organization) return (
        <div className={"flex w-full h-screen translate-x-1/2 translate-y-1/2"}>
            <Loader2 className={"size-[60px] animate-spin duration-300"} />
        </div>
    )
    else redirect(`/workspace/${organization.orgCode}`)
};
export default DashboardPage;
