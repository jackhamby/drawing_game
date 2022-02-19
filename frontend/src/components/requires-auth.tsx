import useAuth from "../hooks/useAuth"
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export const RequiresAuth = (props: { children: JSX.Element}) => {
    const { userSession, logout } = useAuth();

    useEffect(() => {
        if (!userSession?.token) return;
        const tokenData = JSON.parse(atob(userSession.token.split('.')[1]!));
        if (Date.now() >= tokenData.exp * 1000) {
            logout();
        }
    }, [userSession, logout])

    if (userSession?.token){
        return props.children;
    }

    return <Navigate to="/login"/>
}
