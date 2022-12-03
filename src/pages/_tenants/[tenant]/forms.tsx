import { WithChildren } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { DrawerNavMenuItem } from "@/components/DrawerNavMenuItem";
import { EndDrawer } from "@/components/EndDrawer";
import { EndDrawerData } from "@/types/EndDrawerData";
import { Modal } from "@/components/Modal";
import { ModalData } from "@/types/ModalData";
import { ModalPosition } from "@/types/ModalPosition";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Toast } from "@/components/Toast";
import { useDrawer } from "@/lib/hooks/useDrawer";
import { useEndDrawer } from "@/lib/hooks/useEndDrawer";
import { useModel } from "@/lib/hooks/useModel";
import { Provider } from "@/lib/context";



const Layout = ({ children, ...props }: WithChildren) => {
    //const [sideBarShowing, showSidebar] = useStore((store) => store.drawerData?.show);
   // const [navItems, setNavMenus] = useStore((store) => store.drawerData?.menus);
   const {data,open,close: closeDrawer}=useDrawer();
   const {show,menus} = data??{};
    return (
        <div {...props}>
            <Navbar />
            <Toast />
            <Modal />
            <ProgressIndicator />

            <div className="drawer drawer-mobile">
                <input id="my-drawer" type="checkbox" checked={show} className="drawer-toggle" readOnly />


                <div className="drawer-content flex flex-col items-stretch">
                    {/* <!-- Page content here --> */}
                    <EndDrawer>
                        <Breadcrumb />

                        <div className="flex flex-1 flex-col mx-4 mb-4 mt-2 ">
                            {children}

                        </div>
                        {/* <div className=" p-2 flex-none flex justify-end items-center">
                     <Pagination /> 
                    </div> */}
                        <div className="flex-none">
                            <Footer />
                        </div>

                    </EndDrawer>

                </div>
                <div className="drawer-side ">
                    <label htmlFor="my-drawer" className="drawer-overlay" onClick={(e) => {
                        closeDrawer();
                    }}></label>

                    <ul className=" w-48 bg-base-100 text-base-content border-r-2 border-gray-100 overflow-x-hidden">
                        {menus?.map((menu) => <DrawerNavMenuItem key={menu.name} menu={menu} />)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Breadcrumb() {
    const [show, hide, data] = useModel();
    const {update} = useEndDrawer();
    const modalData: ModalData = {
        position: ModalPosition.middle,
        content: ({ show, hide, ModalContainer, ModalContent, ModalAction }) => {
            return (
                <ModalContainer >
                    <ModalContent className="">
                        <div >hello world content</div>
                        <ModalAction >
                            <label htmlFor="primary-modal" className="btn btn-error">Close</label>
                        </ModalAction>
                    </ModalContent>
                </ModalContainer>
            )
        }
    }
    const endDrawerData:EndDrawerData = {
        content:({ContentContainer})=>{
            return (
                <ContentContainer className="w-80">
                 <ul className="menu">
                 <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                 </ul>
                </ContentContainer>
            )
        }
    }
    return (
        <div className="text-xs breadcrumbs mx-4 text-info">
            <ul>
                <li onClick={() => show(modalData)}><a >Home</a></li>
                <li onClick={() => hide()}><a>Documents</a></li>
                <li onClick={() => update({...endDrawerData,show:true})}>Add Document</li>
            </ul>
        </div>);
}

export default function Wrapper() {
    return (<Provider> <Layout ><DashBoard /></Layout></Provider>);
}


function Footer() {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content">
            <div>
                <span className="footer-title">Services</span>
                <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
            </div>
            <div>
                <span className="footer-title">Company</span>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </div>
            <div>
                <span className="footer-title">Legal</span>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
                <a className="link link-hover">Cookie policy</a>
            </div>
        </footer>
    )
}
function Navbar() {
   const {data,close}=useDrawer();
   const {show: sideBarShowing} = data??{};
    const session = useSession();
    return (
        <div className="navbar bg-base-100 border-b-2 border-gray-100">
            <div className="flex-none"  >

                {/* <button onClick={(e)=>{
                    updateDrawer({drawerIsOpen:!sideBarShowing})
                }} className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button> */}


                <label className="btn btn-circle swap swap-rotate lg:hidden" >
                    <input checked={sideBarShowing} type="checkbox" className="hidden" onChange={(e) => {
                        console.log();
                        if (e.target.checked !== sideBarShowing) {
                            e.target.checked?open():close();
                        }

                    }} />

                    <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>

                    <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>

                </label>

            </div>
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-lg">
                    <Image

                        src="/logo-yavin2.png"
                        width={40}
                        height={40}
                        alt="logo" /> <span className="mx-2">Shop care</span>
                </a>
            </div>
            <div className="flex-none">
                {/* <button className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                </button> */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {session.status == "authenticated" && <Image
                                src={session.data.user.image ?? "/no_avator.png"}
                                width={40}
                                height={40}
                                alt={session.data.user.name ?? "User avatar"} />}


                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function DashBoard() {

    return (
        <div className="stats shadow">

            <div className="stat">
                <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <div className="stat-title">Total Likes</div>
                <div className="stat-value text-primary">25.6K</div>
                <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div className="stat-title">Page Views</div>
                <div className="stat-value text-secondary">2.6M</div>
                <div className="stat-desc">21% more than last month</div>
            </div>

            <div className="stat">
                <div className="stat-figure text-secondary">
                    <div className="avatar online">
                        <div className="w-16 rounded-full">
                            <img src="https://placeimg.com/128/128/people" />
                        </div>
                    </div>
                </div>
                <div className="stat-value">86%</div>
                <div className="stat-title">Tasks done</div>
                <div className="stat-desc text-secondary">31 tasks remaining</div>
            </div>

        </div>
    )
}
function Pagination() {

    return (<div className="btn-group">
        <button className="btn">1</button>
        <button className="btn">2</button>
        <button className="btn btn-disabled">...</button>
        <button className="btn">99</button>
        <button className="btn">100</button>
    </div>)
}