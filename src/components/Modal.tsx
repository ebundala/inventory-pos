import React from "react";
import { useModal } from "@/lib/hooks/useModel";
import { ModalSectionProps } from "@/types/ModalSectionProps";

export function Modal() {
    const [showModal, hide, data] = useModal();
    const { show, content, position } = data ?? {};



    function ModalContainer({ children, className, ...props }: ModalSectionProps) {
        return (
            <div className={`modal ${position} ${className ?? ""}`} {...props}>
                {children instanceof Function ? children({ show: showModal, hide }) : children}
            </div>
        );
    }
    function ModalContent({ children, className, ...props }: ModalSectionProps) {
        return (
            <div className={`modal-box ${className ?? ""}`} {...props}>
                {children instanceof Function ? children({ show: showModal, hide }) : children}
            </div>
        );
    }

    function ModalAction({ children, className, ...props }: ModalSectionProps) {
        return (
            <div className={`modal-action ${className ?? ""}`} {...props}>
                {children instanceof Function ? children({ show: showModal, hide }) : children}

            </div>
        );
    }
    return (<>


        <input type="checkbox" checked={show} id="primary-modal" className="modal-toggle" onChange={(e) => {
            if (!e.target.checked) {
                hide();
            }
        }} />

        {content instanceof Function ? content({
            show: showModal, hide,
            ModalContainer,
            ModalContent,
            ModalAction
        }) : content}

    </>
    );
}
