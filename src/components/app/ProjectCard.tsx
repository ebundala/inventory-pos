
export default function ProjectCard({ id, name, customDomain, subdomain, plan, onManage, onOpen }: {
    id: string; name: string; customDomain?: string | null; subdomain: string; plan?: string | null;
    onManage: (e: {
        id: string; name: string; customDomain?: string | null; subdomain: string; plan?: string | null;
    }) => void;
    onOpen: (e: unknown) => void;
}) {
    return (<div className="w-[280px] h-[280px] p-4 m-4 border border-gray-600 flex flex-col justify-around items-center rounded-lg">

        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">name:</p> <p className="font-medium text-lg">{name}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">subdomain:</p> <p className="font-medium text-lg">{subdomain}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">domain:</p> <p className="font-medium text-lg">{customDomain}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">plan:</p> <p className="font-medium text-lg">{plan}</p>
        </div>
        <div className="py-1 flex justify-start items-center font-sans">
            <p className="mr-1 capitalize font-light text-sm">id:</p> <p className="font-medium text-lg">{id}</p>
        </div>
        <div className="flex flex-row justify-between  items-center w-full h-12 font-sans">

            <button onClick={(e) => {
                e.preventDefault();
                onManage({ id, name, subdomain, customDomain, plan });
            }} className="bg-gray-600 m-2 p-2 capitalize text-white rounded-lg w-2/4">
                manage
            </button>
            <button onClick={onOpen} className="bg-gray-800 m-2 p-2 capitalize text-white rounded-lg w-2/4">
                open
            </button>
        </div>
    </div>);
}
