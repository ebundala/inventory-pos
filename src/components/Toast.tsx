import React, { useEffect, useMemo } from "react";
import { ToastMessage } from "@/types//ToastMessage";
import { useToast } from "@/lib/hooks/useToast";

export function Toast() {
    const [add, remove, messages] = useToast();
    const show = messages.size;
    const messagesArr = useMemo<ToastMessage[]>(() => {
        const arr: ToastMessage[] = [];
        messages.forEach((e) => {
            arr.push(e);
        });
        return arr;
    }, [messages]);
    function getDismiss(m: ToastMessage) {
        if (messages.has(m)) {
            return () => {
                remove(m);
            };
        };
        return () => { };
    }

    function AlertBuilder({ m, dismiss, send }: {
        m: ToastMessage;
        dismiss: () => void;
        send: (m: ToastMessage) => void;
    }) {
        useEffect(() => {
            if (m.timeout > 0) {
                setTimeout(() => {

                    dismiss();
                }, m.timeout);
            }
        }, [m.timeout, dismiss]);
        const content = m.content instanceof Function ? m.content({ dismiss, send }) : m.content;

        return (
            <div key={m.id} className={`alert ${m.type}`}>
                <div>
                    {content}
                </div>
            </div>
        );
    };


    return (
        <div className={`toast toast-top toast-end z-40 ${!show ? 'hidden' : ''}`}>
            {messagesArr.map((m) => <AlertBuilder key={m.id} m={m} dismiss={getDismiss(m)} send={add} />)}
        </div>);


}
