import { useCallback } from "react";
import { ToastMessage } from "@/types/ToastMessage";
import { useStore } from "@/lib/context";

export function useToast() {
    const [messages, setMessages] = useStore((s) => s.toastMessages);

    const clearToast = useCallback((m: ToastMessage) => {
        if (messages.has(m.id)) {
            messages.delete(m.id);
            const newMsgs = new Map(messages.entries());

            setMessages({ toastMessages: newMsgs });
        }
    }, [messages, setMessages]);

    const showToast = useCallback((m: ToastMessage) => {
        if (!messages.has(m.id)) {
            messages.set(m.id,m);
            const newMsgs = new Map(messages.entries());;
            setMessages({ toastMessages: newMsgs });
        }
    }, [setMessages, messages]);

    return {showToast,clearToast,messages};
}
