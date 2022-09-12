import React from 'react'
import {
  CollectionIcon,
  ChartPieIcon,
  UserIcon,
  PlusSmIcon,
} from '@heroicons/react/outline'
import NavBarLink from './NavBarLink'

import { useRouter } from 'next/router'
import { modalState } from '../../atoms/modalAtom'
import { useRecoilState } from 'recoil'

const NavBar = () => {
  const NAV_ITEMS = [
    { name: 'Weights', path: '/', icon: CollectionIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartPieIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ]

  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const router = useRouter()

  return (
    <div>
      <nav className="fixed bottom-0 z-20 h-[90px] w-full bg-white/30 p-2 backdrop-blur-lg sm:h-full sm:w-auto sm:flex-col sm:items-center sm:border-r-2 lg:w-[240px]">
        <div className="flex flex-row justify-evenly sm:mt-20 sm:mb-2.5 sm:flex-col sm:justify-start sm:space-y-2.5 sm:px-0">
          {NAV_ITEMS.map((navItem) => (
            <NavBarLink
              key={navItem.name}
              text={navItem.name}
              Icon={navItem.icon}
              active={navItem.path === router.asPath}
            />
          ))}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className=" mt-10 hidden h-[52px] w-56 rounded-full bg-red-400 font-bold text-white shadow-md transition ease-in hover:bg-red-300 lg:inline"
        >
          Add weight
        </button>
        <div
          onClick={() => setModalOpen(true)}
          className="absolute bottom-[100px] right-[22px] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-red-400 font-bold text-white shadow-md transition ease-in hover:bg-red-300 sm:relative sm:right-0 sm:mt-[138px] lg:hidden"
        >
          <PlusSmIcon className="h-7" />
        </div>
      </nav>
    </div>
  )
}

export default NavBar
