import { useRouter } from "next/router";
import { useProgressIndicator } from "@/lib/hooks/useProgressIndicator";
import { useToast } from "@/lib/hooks/useToast";
import { ToastMessageType } from "@/types/ToastMessageType";

export function useProgressFeedback(redirect?: string) {
    const [showProgress, hideProgress, progressData] = useProgressIndicator();
    const { showToast, messages } = useToast();
    const router = useRouter();
    const callbacks = {
        onSuccess: (data: unknown) => {
            hideProgress();
            showToast({
                timeout: 5000,
                type: ToastMessageType.warning,
                content: <span>Success</span>,
                id: Date.now().toString()
            });
            if (redirect) {
                setTimeout(() => {
                    router.replace(redirect);
                }, 5000);
            }
        },
        onError: ({ message }: { message: string; }) => {
            hideProgress();
            showToast({
                timeout: 15000,
                type: ToastMessageType.error,
                content: <span>{message}</span>,
                id: Date.now().toString()
            });
        }
    };
    return { showProgress, hideProgress, callbacks };
}
