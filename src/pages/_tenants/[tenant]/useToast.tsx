import { useCallback } from "react";
import { ToastMessage } from "./ToastMessage";
import { useStore } from "./forms";
// const data=new Set<ToastMessage>()
// data.add({
//     id:"xx",content:"message here",type:ToastMessageType.info,timeout:5000
// })
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

    const result: [typeof show, typeof clear, typeof messages] = [show, clear, messages];
    return result;
}
