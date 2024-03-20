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
            if (redirect) {
                setTimeout(() => {
                    router.replace(redirect);
                }, 100);
            }
            showToast({
                timeout: 5000,
                type: ToastMessageType.success,
                content: <span>Success</span>,
                id: Date.now().toString()
            });
          
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
