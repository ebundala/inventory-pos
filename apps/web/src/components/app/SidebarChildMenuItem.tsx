import { ReactNode } from "react";

export default function SidebarChildMenuItem({
    icon, text, onSelected
}: {
    icon: ReactNode;
    text: string;
    onSelected: (e: unknown) => void;
}): JSX.Element {
    return (
        <div onClick={(e) => {
            e.preventDefault();
            onSelected(e);
        }} className="flex h-12 w-full justify-start items-center p-2 border-b-2 border-grey-200 cursor-pointer">
            <div className="w-2/6 h-full flex justify-center items-center select-none">
                {icon}
            </div>
            <span className="w-4/6 pl-1 capitalize text-sm text-ellipsis align-middle select-none">
                {text}
            </span>
        </div>);
}
