import { useCallback } from "react";
import { ToastMessage } from "@/types/ToastMessage";
import { useStore } from "@/lib/context";

export function useToast() {
    const [messages, setMessages] = useStore((s) => s.toastMessages);

    const clearToast = useCallback((m: ToastMessage) => {
        if (messages.has(m)) {
            messages.delete(m);
            const newMsgs = new Set(messages.values());

            setMessages({ toastMessages: newMsgs });
        }
    }, [messages, setMessages]);

    const showToast = useCallback((m: ToastMessage) => {
        if (!messages.has(m)) {
            messages.add(m);
            const newMsgs = new Set(messages.values());
            setMessages({ toastMessages: newMsgs });
        }
    }, [setMessages, messages]);

    return {showToast,clearToast,messages};
}
