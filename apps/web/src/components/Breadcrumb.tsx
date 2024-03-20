import React from "react";
import { EndDrawerData } from "@/types/EndDrawerData";
import { ModalData } from "@/types/ModalData";
import { ModalPosition } from "@/types/ModalPosition";
import { useEndDrawer } from "@/lib/hooks/useEndDrawer";
import { useModal } from "@/lib/hooks/useModel";


export function Breadcrumb() {
    const [show, hide, data] = useModal();
    const { update } = useEndDrawer();
    const modalData: ModalData = {
        position: ModalPosition.middle,
        content: ({ show, hide, ModalContainer, ModalContent, ModalAction }) => {
            return (
                <ModalContainer>
                    <ModalContent className="">
                        <div>hello world content</div>
                        <ModalAction>
                            <label htmlFor="primary-modal" className="btn btn-error">Close</label>
                        </ModalAction>
                    </ModalContent>
                </ModalContainer>
            );
        }
    };
    const endDrawerData: EndDrawerData = {
        content: ({ ContentContainer }) => {
            return (
                <ContentContainer className="w-80">
                    <ul className="menu">
                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </ContentContainer>
            );
        }
    };
    return (
        <div className="text-xs breadcrumbs mx-4 text-info">
            <ul>
                <li onClick={() => show(modalData)}><a>Home</a></li>
                <li onClick={() => hide()}><a>Documents</a></li>
                <li onClick={() => update({ ...endDrawerData, show: true })}>Add Document</li>
            </ul>
        </div>);
}
