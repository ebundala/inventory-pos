import { useRouter } from "next/router";
import Loader from "@/components/app/Loader";
import { trpc } from "src/utils/trpc";
import { Tenant } from "@prisma/client";
import  ProjectCard  from "@/components/app/ProjectCard";
import { useHost } from "@/lib/hooks/useHost";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";

export default function ProjectsList({ id, onNewProject, onManage, ...props }: {
    id: string; onNewProject: (e:any ) => void;
    onManage: (e: Tenant) => void;
}) {
    const router = useRouter();
    const host = useHost();
    const tenants = useTrpcTenant().tenant.search.useQuery({
        where: {
            members: {
                some: {
                    id: id
                }
            }
        }
    });
    const getUrl = (subdomain: string) => {
        const slices = host?.split(".").slice(-2).join(".")
        return `http://${subdomain}.${slices}`;
    };

    return (
        <div {...props} className="w-full h-fit">
            <div className="flex flex-row h-16 w-full justify-start items-center border-b border-gray-200">
                <h2 className="font-semibold font-sans text-lg">All businesses</h2>

            </div>
            <div className="flex flex-row h-16 w-full justify-end items-center">
                <label className="hidden" htmlFor="search_project">Search project:</label>
                <input id="search_project" type="text" placeholder="eg. subdomain,domain or id" className="hidden m-2 p-2 rounded-md "></input>
                <button onClick={()=>onNewProject(tenants)} className=" m-2 p-2 bg-gray-800 capitalize text-white font-sans font-medium rounded-md">
                    New business
                </button>
            </div>

            <div className="h-fit w-full flex flex-wrap justify-start items-center">
                {tenants.isLoading && <div className="m-auto"><Loader></Loader></div>}
                {(tenants.isSuccess && tenants.data?.length===0)&&<h2 className="m-auto text-4xl text-gray-400">Create a business to get started.</h2>}
                {tenants.isSuccess && tenants.data.map((v) => (<ProjectCard key={v.tenantId}
                    id={v.tenantId}
                    name={v.name!}
                    
                    customDomain={getUrl(v.subdomain!) ?? v.customDomain!}
                    subdomain={v.subdomain!}
                    onManage={(e) => {
                        onManage(v);

                    }}
                    onOpen={(e) => {
                        //TODO handle custom domain here
                        router.push(getUrl(v.subdomain!));
                    }} />))}
            </div>
        </div>);
}
