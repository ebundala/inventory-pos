import { useState, ReactNode, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useRequireAuth from "@/lib/useRequireAuth";
import Header from "@/components/app/header";
import BlurImage from "@/components/BlurImage";
import Loader from "@/components/app/Loader";
import { trpc } from "src/utils/trpc";
import Modal from "@/components/Modal";
import { Tenant } from "@prisma/client";
import LoadingDots from "@/components/app/loading-dots";

export default function AppIndex() {
    const session = useRequireAuth();
    const [isMenuShowing, showMenu] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const router = useRouter();

    if (!session) return <Loader />;
    const icon = <BlurImage src="/mauzo-top.png" alt="icon" height={40} width={40} />;

    return (
        <div className="bg-gray-100 h-full w-full flex flex-col justify-start">
            <Modal showModal={showModel} setShowModal={setShowModel}>
       <div className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                >
                <ProductForm setShowModel={setShowModel} userId={session!.user!.id!} />
                </div>
            </Modal>
            <Header session={session}
                logo={(<BlurImage width={80} height={80} alt="logo" src="/logo-yavin.png" />)}
                menu={<BurgerMenu />}
                heading={"Dashboard"}
                onMenuClick={(e) => {
                    e.preventDefault();
                    showMenu((v) => !v);
                }}
            >
                <Link key="pos" href="/pos">
                    {icon}
                </Link>,
                <Link key="notification" href="/notification">
                    {icon}
                </Link>
                <Link key="profile" href="/profile">
                    {icon}
                </Link>
            </Header>
            <div className="flex flex-row justify-start h-full w-full">
                <SidebarMenu isMenuShowing={isMenuShowing}>
                    <SidebarMenuItem icon={icon} text="Dashboard">
                    </SidebarMenuItem>
                    <SidebarMenuItem icon={icon} text="Products">
                        <SidebarChildMenuItem icon={icon} text="Sales" onSelected={(e) => {

                        }} />
                        <SidebarChildMenuItem icon={icon} text="Purchases" onSelected={(e) => {

                        }} />
                        <SidebarChildMenuItem icon={icon} text="Peoples" onSelected={(e) => {

                        }} />
                        <SidebarChildMenuItem icon={icon} text="Purchase returns" onSelected={(e) => {

                        }} />
                    </SidebarMenuItem>
                    <SidebarMenuItem icon={icon} text="Sales">
                        <h1>4</h1><h2 >5</h2><h3>6</h3>
                    </SidebarMenuItem>
                    <SidebarMenuItem icon={icon} text="Sale returns">
                        <h1>7</h1><h2 >8</h2><h3>9</h3>
                    </SidebarMenuItem>

                </SidebarMenu>
                <div className="flex flex-col justify-start w-full h-screen border-gray-200 bg-white m-2 p-8 rounded-sm" >
                    <ProjectsList id={session.user!.id!} onNewProject={(e) => {
                        setShowModel(true);
                    }} />
                </div>
            </div>
        </div>
    );
}

function ProductForm({ setShowModel, tenant, userId,...props }: { userId: string, tenant?: Tenant, setShowModel: (v: boolean) => void }) {

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
        })
    }
    const updateTenant = () => {
        if (!tenant) return
        updateMutation.mutateAsync({
            tenantId: tenant!.tenantId!,
            name: projectNameRef.current!.value!,
            subdomain: subdomainRef.current!.value!,
            customDomain: customDomainRef.current!.value!,
            description: descriptionRef.current!.value!,

        })
    }
    useEffect(() => {

        if (tenant) {
            projectNameRef!.current!.value = tenant.name ?? "";
            subdomainRef!.current!.value = tenant.subdomain ?? "";
            customDomainRef!.current!.value = tenant.customDomain ?? "";
            descriptionRef!.current!.value = tenant.description ?? "";
        }
    })


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
                {createMutation.isLoading||updateMutation.isLoading?<LoadingDots></LoadingDots>:
                <button onClick={(e) => {
                    e.preventDefault();
                    if(createMutation.isLoading||updateMutation.isLoading) return
                    if(tenant){
                        updateTenant();
                    }
                    else{
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

function ProjectsList({ id, onNewProject, ...props }: { id: string, onNewProject?: (e: unknown) => void }) {
    const router = useRouter();
    const tenants = trpc.tenant.search.useQuery({
        where: {
            members: {
                some: {
                    id: id
                }
            }
        }
    });
    const getUrl = (subdomain: string) => {
        return `http://${subdomain}.localhost:3000`
    }
    return (
        <div {...props} className="w-full h-full">
            <div className="flex flex-row h-16 w-full justify-start items-center border-b border-gray-200">
                <h2 className="font-semibold font-sans text-lg">All Projects</h2>

            </div>
            <div className="flex flex-row h-16 w-full justify-end items-center">
                <label htmlFor="search_project">Search project:</label>
                <input id="search_project" type="text" placeholder="eg. subdomain,domain or id" className=" m-2 p-2 rounded-md "></input>
                <button onClick={onNewProject} className=" m-2 p-2 bg-gray-800 capitalize text-white font-sans font-medium rounded-md">
                    New project
                </button>
            </div>

            <div className="h-full w-full flex flex-wrap justify-start items-center" >
                {tenants.isLoading && <div className="m-auto"><Loader></Loader></div>}
                {tenants.isSuccess && tenants.data.map((v) => (<ProjectCard key={v.tenantId}
                    id={v.tenantId}
                    name={v.name!}
                    domain={v.customDomain!}
                    subdomain={v.subdomain!}
                    onManage={(e) => {
                        // router.push(v.customDomain??getUrl(v.subdomain!))
                    }}
                    onOpen={(e) => {
                        //TODO handle custom domain here
                        router.push(getUrl(v.subdomain!))
                    }}
                />))}
            </div>
        </div>)
}
function ProjectCard({ id, name, domain, subdomain, plan, onManage, onOpen }: {
    id: string, name: string, domain?: string | null, subdomain: string, plan?: string | null,
    onManage: (e: unknown) => void,
    onOpen: (e: unknown) => void
}) {
    return (<div className="w-[280px] h-[280px] p-4 m-4 border border-gray-600 flex flex-col justify-around items-center rounded-lg">

        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">name:</p> <p className="font-medium text-lg">{name}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">subdomain:</p> <p className="font-medium text-lg">{subdomain}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">domain:</p> <p className="font-medium text-lg">{domain}</p>
        </div>
        <div className="py-1 flex justify-start items-center">
            <p className="mr-1 capitalize font-light text-sm">plan:</p> <p className="font-medium text-lg">{plan}</p>
        </div>
        <div className="py-1 flex justify-start items-center font-sans">
            <p className="mr-1 capitalize font-light text-sm">id:</p> <p className="font-medium text-lg">{id}</p>
        </div>
        <div className="flex flex-row justify-between  items-center w-full h-12 font-sans">

            <button onClick={onManage} className="bg-gray-600 m-2 p-2 capitalize text-white rounded-lg w-2/4">
                manage
            </button>
            <button onClick={onOpen} className="bg-gray-800 m-2 p-2 capitalize text-white rounded-lg w-2/4">
                open
            </button>
        </div>
    </div>);
}

function BurgerMenu({ ...props }) {
    return (
        <div className="flex flex-col h-6 w-8 justify-around items-center select-none cursor-pointer">
            <div className="h-1 w-full bg-gray-500" />
            <div className="h-1 w-full bg-gray-700" />
            <div className="h-1 w-full bg-gray-500" />
        </div>
    )
}
function SidebarMenu({ children, isMenuShowing, ...props }:
    {
        isMenuShowing: boolean,
        children: ReturnType<typeof SidebarMenuItem>[]
    }) {

    const [subMenus, setSubMenus] = useState<JSX.Element[] | null>(null);
    const [selected, setSelected] = useState(-1);

    const menus: JSX.Element[] = [];
    for (let i = 0; i < children.length; i++) {
        const v = children[i];
        const props = {
            selected: selected === i,
            onSelected: (v: JSX.Element[]) => {
                if (selected === i || !v) {
                    setSubMenus(() => null);
                    setSelected(() => -1);
                } else {
                    setSubMenus(() => v.length ? v : null);
                    setSelected(() => i);
                }
            }, ...v.props
        }

        menus.push((<SidebarMenuItem {...props} key={i} />));
    }

    return (
        <div {...props} className={` justify-start border-r border-gray-300 h-screen ${subMenus?.length ? "w-1/4" : "w-1/12"} bg-white
        ${isMenuShowing ? "flex" : "hidden"}`}>
            <div className={`py-2 h-full ${subMenus?.length ? "w-1/3" : "w-full"} flex flex-col justify-start items-center border-r border-gray-300`}>
                {menus}
            </div>
            {subMenus?.length && <div className={`py-2 h-full w-2/3 flex flex-col justify-start items-center border-r border-gray-300`}>
                {subMenus}
            </div>}
        </div>
    )
}

function SidebarMenuItem({ children, icon, onSelected, selected, text, ...props }:
    {
        icon: ReactNode,
        text: string,
        selected?: boolean,
        onSelected?: (menus: ReactNode) => void
        children?: ReturnType<typeof SidebarChildMenuItem>[]
    }) {
    const subMenus: ReturnType<typeof SidebarChildMenuItem>[] = [];
    for (let i = 0; i < (children ?? []).length; i++) {
        const v = children![i];
        const props = {
            ...v.props, onSelected: (e: unknown) => {
                if (onSelected) {
                    onSelected(null);
                }

                if (v.props?.onSelected) {
                    v.props.onSelected(e)
                }
            }
        };
        subMenus.push(<SidebarChildMenuItem key={i} {...props} />)
    }
    return (
        <div  {...props} onClick={(e) => {
            e.preventDefault();
            if (onSelected) {
                onSelected(subMenus);
            }
        }}


            className={` flex flex-col justify-center items-center w-full border-b-2 
        ${selected ? " border-gray-500" : "border-gray-200"}  pb-2 select-none cursor-pointer`}>
            <div className="m-2 p-0">
                {icon}
            </div>
            <div className="p-0 capitalize select-none">
                {text}
            </div>
        </div>
    )
}


function SidebarChildMenuItem({
    icon, text, onSelected
}: {
    icon: ReactNode,
    text: string,
    onSelected: (e: unknown) => void
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
        </div>)
}