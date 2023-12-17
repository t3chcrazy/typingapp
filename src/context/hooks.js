import { useContext } from "react";
import { UserSession } from ".";

export function useSessionData() {
    const { session } = useContext(UserSession)

    return session
}