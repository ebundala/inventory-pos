import { WithChildren } from '@/types'
import { Session } from 'next-auth'
import Link from 'next/link'
import { MouseEventHandler, ReactNode, useCallback } from 'react'
import Image from "next/image";


interface HeaderProps extends WithChildren {
  session: Session,
  heading: string,
  menu?: ReactNode
  logo?: ReactNode,
  onMenuClick?: MouseEventHandler<HTMLDivElement> | undefined 
}
export default function Header({ session,onMenuClick, logo, menu, heading, children }: HeaderProps) {
  
  return (
    <header className='"absolute left-0 right-0 h-16 border-b bg-white border-gray-200"'>
      {/* <div className='flex justify-between items-center h-full max-w-screen-xl mx-auto px-10 sm:px-20'/> */}
      <div className='flex justify-between items-center h-full max-w-screen-xl mx-auto'>
        <div className='h-full w-1/6 flex justify-around items-center '>
          <div className='h-full w-1/2 flex justify-center items-center '>
            <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle"
           >
              {logo && logo}
            </div>           
          </div>
          <div className='h-full w-1/2 flex justify-center items-center'
           onClick={onMenuClick}
          >
              {menu && menu}
            </div>
        </div>
        <h1 className='text-bold capitalize font-sans w-3/6'>
          {heading}
        </h1>
        <div className='flex w-1/12 justify-center items-center'>
          {children}
        </div>
        <div className=' w-1/6 '>
        <Link href="/" >
          <a className="flex justify-center items-center">
            {session.user && session.user.image && (
              <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                <Image
                  src={session.user.image}
                  width={40}
                  height={40}
                  alt={session.user.name ?? "User avatar"}
                />
              </div>
            )}
            <span className="sm:block inline-block ml-3 font-medium truncate">
              {session.user?.name}
            </span>
          </a>
        </Link>
        </div>
      </div>
    </header>
  )
}