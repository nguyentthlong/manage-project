import { useContext } from "react";
import { toast } from 'react-toastify';
import { AuthenContext } from "../context/AuthenContext";

export function useError() {
    let { logout } = useContext(AuthenContext)

    function showError(code) {
        if (code === 401)
            logout()
        else if (code === 408)
            toast("Ket noi mang!!", { position: toast.POSITION.TOP_RIGHT, type: 'error', theme: 'colored' })
        else if (code === 500)
            toast("Loi xay ra!!", { position: toast.POSITION.TOP_RIGHT, type: 'error', theme: 'colored' })
        else
            toast(`Loi ${code}`, { position: toast.POSITION.TOP_RIGHT, type: 'error', theme: 'colored' })
    }

    return { showError }
}