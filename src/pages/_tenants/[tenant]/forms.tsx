import createFastContext from "@/core/util/createFastContext";
import { WithChildren } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { menus } from "./menus";

interface AppState {
    menus: LinkMenuData[]
    drawerIsOpen: boolean,
    drawerMenus: [],
    drawerActiveMenu: number[],
    drawerFocusedMenuKey?: string,
    progressIndicator?: ProgressIndicatorData & { show: boolean }

    // endDrawer: {
    //     drawerIsOpen: boolean,
    //     drawerMenus: [],
    //     activeMenu: number[]
    // },
    // toast: {
    //     toastIsOpen: boolean,
    //     toastMessage: string,
    //     toastType: "error" | "success" | "warning" | "info"
    // },
    // modal: {
    //     modalIsOpen: boolean,
    //     modalMessage: string,
    //     modalType: "error" | "success" | "warning" | "info"
    // },
    // notifications:{}
}
const { Provider, useStore } = createFastContext<AppState>({
    menus,
    drawerIsOpen: false,
    drawerMenus: [],
    drawerActiveMenu: []

})

export type LinkMenuData = {
    name: string,
    link: string,
    icon?: ReactNode,
    disabled?: boolean,
    active?: boolean,
    subMenus?: LinkMenuData[]
}
const Layout = ({ children, ...props }: WithChildren) => {
    const [sideBarShowing, showSidebar] = useStore((store) => store.drawerIsOpen);
    const [navItems, setNavMenus] = useStore((store) => store.menus);

    return (
        <div {...props}>
            <Navbar />
            {/* <Toast/> */}
            {/* <Modal/> */}
            <ProgressIndicator />

            <div className="drawer drawer-mobile">
                <input id="my-drawer" type="checkbox" checked={sideBarShowing} className="drawer-toggle" />


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
                        showSidebar({ drawerIsOpen: false })
                    }}></label>

                    <ul className=" w-48 bg-base-100 text-base-content border-r-2 border-gray-100 overflow-x-hidden">
                        {navItems.map((menu) => <DrawerNavMenuItem key={menu.name} menu={menu} />)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Breadcrumb() {
    const [show,hide,data] = useProgressIndicator();

    return (
        <div className="text-xs breadcrumbs mx-4 text-info">
            <ul>
                <li><a onClick={
                    ()=>{
                       show({children:"test",speed:2,animated:true}) 
                    }
                }>Home</a></li>
                <li><a>Documents</a></li>
                <li onClick={
                    ()=>{
                      hide(); 
                    }
                }>Add Document</li>
            </ul>
        </div>);
}

export default function Wrapper() {
    return (<Provider> <Layout ><DashBoard /></Layout></Provider>);
}


function DrawerNavMenuItem({ menu }: { menu: LinkMenuData }) {
    const [focusedMenu, setFocusedMenuKey] = useStore((store) => store.drawerFocusedMenuKey);
    const collapsible = (menu.subMenus?.length ?? 0) > 0;
    const menuContent = (<div className="collapse-title flex flex-col items-center">
        {menu.icon} <span className="text-sm mt-2">{menu.name}</span>
    </div>)



    return (<li className={`${collapsible ? "collapse collapse-arrow" : ""} border-b-2`}

        onClick={
            (e) => {
                if (menu.name === focusedMenu) {
                    setFocusedMenuKey({ drawerFocusedMenuKey: undefined });
                }
                else {
                    setFocusedMenuKey({ drawerFocusedMenuKey: menu.name });
                }

            }
        }>
        <input className="hidden" type="checkbox" checked={focusedMenu === menu.name} />
        {collapsible ? menuContent : <Link href={menu.link}>{menuContent}</Link>}
        {collapsible && <div className="collapse-content" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }
        }>

            <ul className="menu text-xs " >
                {menu.subMenus!.map((submenu) => {
                    return (
                        <li key={submenu.name}>
                            <Link href={submenu.link}>
                                <a>
                                    {submenu.icon}{submenu.name}
                                </a>
                            </Link>
                        </li>)
                })
                }
            </ul>
        </div>
        }
    </li>)
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
    const [sideBarShowing, updateDrawer] = useStore((store) => store.drawerIsOpen);
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
                            updateDrawer({ drawerIsOpen: e.target.checked })
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



function Toast() {
    const [messages, setMessages] = [] as any
    return (
        <div className="toast toast-top toast-end z-40">
            <div className="alert alert-info">
                <div>
                    <span>New mail arrived.</span>
                </div>
            </div>
            <div className="alert alert-success">
                <div>
                    <span>Message sent successfully.</span>
                </div>
            </div>
        </div>)
}



function Modal() {
    return (<>
        {/* The button to open modal */}
        {/* <label htmlFor="my-modal-5" className="btn">open modal</label> */}

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-5" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
                <p className="py-4">Youve been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
                <div className="modal-action">
                    <label htmlFor="my-modal-5" className="btn">Yay!</label>
                </div>
            </div>
        </div>
    </>
    )
}

function EndDrawer({ children }: WithChildren) {
    return (
        <div className="drawer drawer-end">
            <input id="EndDrawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="EndDrawer" className="drawer-button btn btn-primary">Open drawer</label>

                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="EndDrawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-38 bg-base-100 text-base-content">
                    {/* <!-- Sidebar content here --> */}
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    )
}

interface ProgressIndicatorData {
    animated?: boolean,
    value?: number,
    speed?: number,
    children?: ReactNode | { (props?: ProgressIndicatorData): ReactNode }
}
function RadialProgress({ animated, value = 0, speed = 1, children }: ProgressIndicatorData) {
    const [progress, setValue] = useState(value);
    useEffect(() => {
        requestAnimationFrame(() => {
            if (!animated) return;
            if (progress >= 100) {
                setValue(0);
            } else {
                setValue((p) => p + speed)
            }
        })
    }, [progress, animated, value, speed])
    const child = children instanceof Function ? children!({ value: progress, animated, speed }) : children;
    return (<div className="radial-progress text-primary z-40" {...({ style: { "--value": progress } } as any)}>{
        child ?? `${progress}%`}</div>
    )
}

function useProgressIndicator() {
    const [data, setIndicatorData] = useStore((s) => s.progressIndicator)
    
    const clear = useCallback(() => {
        setIndicatorData({ progressIndicator: { ...data, children: null, show: false, } })
    }, [data, setIndicatorData])

    const show = useCallback((config: ProgressIndicatorData) => {
        setIndicatorData({ progressIndicator: { ...config, show: true } })
    }, [setIndicatorData])

    // useEffect(() => {
    //     return () => clear()
    // }, [])

    const result:[typeof show,typeof clear, typeof data]=[show, clear, data];
    return result;
}

function ProgressIndicator() {
    const [data, _] = useStore((s) => s.progressIndicator)
    const { animated, children, value, speed, show } = data ?? {};
    return (<div className={`toast toast-center toast-middle z-40 ${!show ? "hidden" : ""}`}>
        {/* add an indicator here */}
        <RadialProgress animated={animated} value={value} speed={speed}>
            {children}
        </RadialProgress>
    </div>)
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