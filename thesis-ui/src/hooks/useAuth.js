import { useContext } from "react";
import { AuthenContext } from "../context/AuthenContext";

export function useAuth() {
    let ctx = useContext(AuthenContext)
    return ctx
}