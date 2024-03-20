import { useRef, useEffect } from "react";
import { trpc } from "src/utils/trpc";
import { Tenant } from "@prisma/client";
import LoadingDots from "@/components/app/loading-dots";

export default function ProjectForm({ setShowModel, tenant, userId, ...props }: { userId: string; tenant?: Tenant | null; setShowModel: (v: boolean) => void; }) {

    const projectNameRef = useRef<HTMLInputElement | null>(null);
    const subdomainRef = useRef<HTMLInputElement | null>(null);
    const customDomainRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);

    const createMutation = trpc.tenant.create.useMutation();
    const updateMutation = trpc.tenant.update.useMutation();

    const createTenant = () => {
        createMutation.mutateAsync({
            name: projectNameRef.current!.value!,
            subdomain: subdomainRef.current!.value!,
            customDomain: customDomainRef.current!.value!,
            description: descriptionRef.current!.value!,
            userId: userId
        });
    };
    const updateTenant = () => {
        if (!tenant)
            return;
        // updateMutation.mutateAsync({
        //     tenantId: tenant!.tenantId!,
        //     name: projectNameRef.current!.value!,
        //     subdomain: subdomainRef.current!.value!,
        //     customDomain: customDomainRef.current!.value!,
        //     description: descriptionRef.current!.value!,
        // });
    };
    useEffect(() => {

        if (tenant) {
            projectNameRef!.current!.value = tenant.name ?? "";
            subdomainRef!.current!.value = tenant.subdomain ?? "";
            customDomainRef!.current!.value = tenant.customDomain ?? "";
            descriptionRef!.current!.value = tenant.description ?? "";
        }
    });


    return (<form {...props}
        onSubmit={(event) => {
            event.preventDefault();
        }}
        className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle "
    >
        <h2 className="font-cal text-2xl mb-6 capitalize">{`${tenant ? "Update a" : "Create a New"} project`}</h2>
        <div className="grid gap-y-5 w-5/6 mx-auto  mb-6">

            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                <span className="pl-5 pr-1">📌</span>

                <input className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                    name="name"
                    required
                    ref={projectNameRef}
                    type="text" placeholder="project name"></input>
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                <span className="pl-5 pr-1">📌</span>

                <input className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                    name="subdomain"
                    required
                    ref={subdomainRef}
                    type="text" placeholder="subdomain"></input>
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                <span className="pl-5 pr-1">📌</span>

                <input className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                    name="custom_domain"
                    ref={customDomainRef}
                    type="text" placeholder="Custom domain"></input>
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
                <span className="pl-5 pr-1">📌</span>

                <input className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                    name="description"
                    ref={descriptionRef}
                    type="text" placeholder="description"></input>
            </div>
            <div className="flex flex-row justify-between  items-center w-full h-12 font-sans">

                <button onClick={(e) => {
                    e.preventDefault();
                    setShowModel(false);
                }} className="bg-gray-600 m-2 p-2 capitalize text-white rounded-lg w-2/4">
                    cancel
                </button>
                {createMutation.isLoading || updateMutation.isLoading ? <LoadingDots></LoadingDots> :
                    <button onClick={(e) => {
                        e.preventDefault();
                        if (createMutation.isLoading || updateMutation.isLoading)
                            return;
                        if (tenant) {
                            updateTenant();
                        }
                        else {
                            createTenant();

                        }
                    }}
                        className="bg-gray-800 m-2 p-2 capitalize text-white rounded-lg w-2/4"

                    >
                        Save
                    </button>}
            </div>
        </div>
    </form>);
}
