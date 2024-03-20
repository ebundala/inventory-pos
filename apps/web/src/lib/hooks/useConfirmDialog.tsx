import { useModal } from "@/lib/hooks/useModel";
import { ModalPosition } from "@/types/ModalPosition";
import { ReactNode } from "react";

export function useConfirmDialog({ message }: { message: ReactNode; }) {
    const [showModal] = useModal();
    function showConfirmDialog(callback: () => void) {
        return showModal({
            position: ModalPosition.middle,
            content: ({ show, hide, ModalAction, ModalContainer, ModalContent }) => {
                return (
                    <ModalContainer>
                        <ModalContent>
                            <h2 className="text-2xl text-warning text-center ">{message} </h2>
                            <ModalAction>
                                <button
                                    onClick={() => hide()}
                                    className="btn btn-info rounded-md">
                                    No
                                </button>
                                <button
                                    onClick={() => {
                                        hide();
                                        callback();
                                    }}
                                    className="btn btn-error rounded-md">
                                    Yes
                                </button>

                            </ModalAction>
                        </ModalContent>

                    </ModalContainer>
                );

            }
        });
    }

    return showConfirmDialog;
}
