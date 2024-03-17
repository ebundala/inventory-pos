import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useDrawer } from "@/lib/hooks/useDrawer";
import { signOut } from "next-auth/react";
import { getLoginUrl } from "@/lib/util/getLoginUrl";
import { router } from "@/core/trpc";
import { getConsoleUrl } from "@/lib/util/getCallbackUrl";
import { useRouter } from "next/router";
import { useHost } from "@/lib/hooks/useHost";
import { useTenant } from "@/lib/hooks/useTenant";
import { useModal } from "@/lib/hooks/useModel";
import { useQRCode } from "next-qrcode";

export function Navbar() {
  const { data, toggle } = useDrawer();
  const { show: sideBarShowing } = data ?? {};
  const session = useSession();
  const router = useRouter();

  const host = useHost();
  const { tenant } = useTenant();
  const [showModal, hideModal] = useModal();
  const { Canvas } = useQRCode();

  return (
    <div className="navbar bg-base-100 border-b-2 border-gray-100">
      <div className="flex-none">
        {/* <button onClick={(e)=>{
                updateDrawer({drawerIsOpen:!sideBarShowing})
            }} className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button> */}

        <label className="btn btn-circle swap swap-rotate lg:hidden">
          <input
            checked={sideBarShowing}
            type="checkbox"
            className="hidden"
            onChange={(e) => {
              if (e.target.checked !== sideBarShowing) {
                e.target.checked ? toggle(false) : toggle(true);
              }
            }}
          />

          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-lg">
          <Image src="/logo-yavin2.png" width={40} height={40} alt="logo" />{" "}
          <span className="mx-2">Shop care</span>
        </a>
      </div>
      <div className="flex-none">
        {/* <button className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
            </button> */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {session.status == "authenticated" && (
                <Image
                  src={session.data.user.image ?? "/logo-yavin2.png"}
                  width={40}
                  height={40}
                  alt={session.data.user.name ?? "User avatar"}
                />
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li
              onClick={(e) => {
                router.push("/settings/system");
              }}
            >
              <a className="justify-between">
                Settings
                <span className="badge">New</span>
              </a>
            </li>
            <li
              onClick={(e) => {
                router.push(getConsoleUrl());
              }}
            >
              <a>Console</a>
            </li>
           {tenant&& <li
              onClick={(e) => {
                // let cookie = document.cookie
                //   .split(";")
                //   .map((c) => c.trim())
                //   .find((c) => c.startsWith("next-auth.session-token"));

                let { members, ...info } = tenant;

                let qr = {
                  session: session.data,
                  host,
                  tenant: info,
                };
                console.log(qr);
                showModal({
                  // position:ModalPosition.
                  content: ({
                    show,
                    hide,
                    ModalContainer,
                    ModalContent,
                    ModalAction,
                  }) => {
                    let logo =((JSON.parse(tenant.logo??"") as string[])??[""]).at(0)??"";
                    return (
                      <ModalContainer>
                        <ModalContent>
                            <h4 className="my-2 text text-lg">Scan QR with pos mobile app</h4>
                          <div className="flex row">
                          <Canvas
                            text={JSON.stringify(qr)}
                            logo={{
                              src:session?.data?.user.image??"",
                              options:{
                                width:56
                              }
                            }}
                            options={{
                              errorCorrectionLevel: "M",
                              
                              margin: 3,
                              
                              scale: 4,
                              width: 200,
                              color: {
                                dark: "#010599FF",
                                light: "#FFBF60FF",
                              },
                            }}
                          />
                          <div className="col ml-2 justify-between">
                            <div>{tenant.name}</div>
                            <div>{tenant.description}</div>
                            <Image width={50} height={50} alt="logo" src={logo}/>
                          </div>
                          </div>
                          <ModalAction>
                            <a
                              className="btn"
                              onClick={() => {
                                hide();
                              }}
                            >
                              Dismiss
                            </a>
                          </ModalAction>
                        </ModalContent>
                      </ModalContainer>
                    );
                  },
                });
              }}
            >
              <a>Mobile pos</a>
            </li>
            }
            <li
              onClick={(e) =>
                signOut({
                  callbackUrl: getLoginUrl(),
                })
              }
            >
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
