import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useRequireAuth from "@/lib/useRequireAuth";
import Header from "@/components/app/header";
import BlurImage from "@/components/BlurImage";
import Loader from "@/components/app/Loader";
import Modal from "@/components/Modal";
import { Tenant } from "@prisma/client";
import ProjectForm from "@/components/app/ProjectForm";
import ProjectsList from "@/components/app/ProjectsList";
import BurgerMenu from "@/components/app/BurgerMenu";
import SidebarMenu from "@/components/app/SidebarMenu";
import SidebarChildMenuItem from "@/components/app/SidebarChildMenuItem";
import SidebarMenuItem from "@/components/app/SidebarMenuItem";

export default function AppIndex() {
    const session = useRequireAuth();
    const [isMenuShowing, showMenu] = useState(false);
    const [showModel, setShowModel] = useState(false);

    if (!session) return <Loader />;
    const icon = <BlurImage src="/mauzo-top.png" alt="icon" height={40} width={40} />;

    return (
        <div className="bg-gray-100 h-full w-full flex flex-col justify-start">
            <Modal showModal={showModel} setShowModal={setShowModel}>
                <div className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
                >
                    <ProjectForm  setShowModel={setShowModel} userId={session!.user!.id!} />
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
                    <ProjectsList id={session.user!.id!}
                        onNewProject={(e) => {
                            setShowModel(true);
                        }}
                        onManage={(v) => {
                           setShowModel(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


