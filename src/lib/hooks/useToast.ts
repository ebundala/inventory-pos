import { useCallback } from "react";
import { ToastMessage } from "@/types/ToastMessage";
import { useStore } from "@/lib/context";

export function useToast() {
    const [messages, setMessages] = useStore((s) => s.toastMessages);

    const clear = useCallback((m: ToastMessage) => {
        if (messages.has(m)) {
            messages.delete(m);
            setMessages({ toastMessages: messages });
        }
    }, [messages, setMessages]);

    const show = useCallback((m: ToastMessage) => {
        if (!messages.has(m)) {
            messages.add(m);
            setMessages({ toastMessages: messages });
        }
    }, [setMessages, messages]);

   // const result: [typeof show, typeof clear, typeof messages] = [show, clear, messages];
    return {showToast:show,clearToast:clear,messages};
}
