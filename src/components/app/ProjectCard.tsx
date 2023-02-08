import { FaLink } from "react-icons/fa";

export default function ProjectCard({ id, name, customDomain, subdomain, plan, onManage, onOpen }: {
    id: string; name: string; customDomain?: string | null; subdomain: string; plan?: string | null;
    onManage: (e: {
        id: string; name: string; customDomain?: string | null; subdomain: string; plan?: string | null;
    }) => void;
    onOpen: (e: unknown) => void;
}) {
    return (<div className="w-[280px] h-[160px] p-4 m-4 border border-gray-300 flex flex-col justify-around items-start rounded-lg">

        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-medium text-base hidden">Name:</p> <p className="font-medium text-md">{name}</p>
        </div>
        <div className="py-1 justify-start items-center hidden">
            <p className="mr-1 capitalize font-light text-sm">subdomain:</p> <p className="font-medium text-md">{subdomain}</p>
        </div>
        
        <div className="py-1  justify-start items-center ">
            <p className="mr-1 capitalize font-medium text-base hidden"></p> <a className="font-medium text-md link-primary " href={customDomain!}>
                <div className="flex items-center gap-1"><FaLink size={20}/>{customDomain}</div>
                </a>
        </div>
        <div className="py-1 flex justify-start items-center font-sans">
            <p className="mr-1 capitalize font-medium text-sm">Business ID:</p> <p className="font-medium text-xs">{id}</p>
        </div>
        <div className="py-1 justify-start items-center hidden">
            <p className="mr-1 capitalize font-light text-base">plan:</p> <p className="font-medium text-lg">{plan}</p>
        </div>
        
        <div className="flex flex-row justify-between  items-center w-full h-12 font-sans">

            <button onClick={(e) => {
                e.preventDefault();
                onManage({ id, name, subdomain, customDomain, plan });
            }} className="btn btn-info hidden">
                manage
            </button>
            <button onClick={onOpen} className="btn btn-primary hidden">
                open
            </button>
        </div>
    </div>);
}
