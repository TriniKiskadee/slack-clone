"use client";
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";
import {PropsWithChildren} from "react";

const AuthProvider = ({children}: PropsWithChildren) => {
    return (
        <KindeProvider>
            {children}
        </KindeProvider>
    )
};

export default AuthProvider;