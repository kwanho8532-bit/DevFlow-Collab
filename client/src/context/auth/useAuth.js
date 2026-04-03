import { useContext } from "react";
import { AuthStateContext } from "./AuthStateContext.jsx";
import { AuthActionContext } from "./AuthActionContext.jsx";

export function useAuthState() {
    const ctx = useContext(AuthStateContext)

    if (ctx === null) {
        throw new Error('useAuthState must be used within AuthProvider')
    }
    return ctx
}

export function useAuthAction() {
    const ctx = useContext(AuthActionContext)

    if (ctx === null) {
        throw new Error('useAuthAction must be used within AuthProvider')
    }
    return ctx
}