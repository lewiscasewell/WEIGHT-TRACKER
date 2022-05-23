import React, { useEffect } from 'react'
import {
  CollectionIcon,
  ChartPieIcon,
  UserIcon,
  PlusSmIcon,
} from '@heroicons/react/outline'

import NavBarLink from './NavBarLink'
import { useRouter } from 'next/router'
import { modalState } from '../atoms/modalAtom'
import { useRecoilState } from 'recoil'
import {
  navWeightsState,
  navAnalyticsState,
  navProfileState,
} from '../atoms/navBarAtom'

const NavBar = () => {
  const [navWeightsActive, setNavWeightsActive] =
    useRecoilState(navWeightsState)
  const [navAnalyticsActive, setNavAnalyticsActive] =
    useRecoilState(navAnalyticsState)
  const [navProfileActive, setNavProfileActive] =
    useRecoilState(navProfileState)
  const NAV_ITEMS = [
    { name: 'Weights', icon: CollectionIcon, active: navWeightsActive },
    { name: 'Analytics', icon: ChartPieIcon, active: navAnalyticsActive },
    { name: 'Profile', icon: UserIcon, active: navProfileActive },
  ]

  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const router = useRouter()

  useEffect(() => {
    if (router.asPath === '/') {
      setNavWeightsActive(true)
      setNavAnalyticsActive(false)
      setNavProfileActive(false)
    }
    if (router.asPath === '/analytics') {
      setNavWeightsActive(false)
      setNavAnalyticsActive(true)
      setNavProfileActive(false)
    }
    if (router.asPath === '/profile') {
      setNavWeightsActive(false)
      setNavAnalyticsActive(false)
      setNavProfileActive(true)
    }
  }, [router.asPath])

  return (
    <div>
      <nav className="fixed bottom-0 z-20 h-[90px] w-full bg-white/30 p-2 backdrop-blur-lg sm:h-full sm:w-auto sm:flex-col sm:items-center sm:border-r-2 lg:w-[240px]">
        <div className="flex flex-row justify-evenly sm:mt-20 sm:mb-2.5 sm:flex-col sm:justify-start sm:space-y-2.5 sm:px-0">
          {NAV_ITEMS.map((navItem) => (
            <NavBarLink
              key={navItem.name}
              text={navItem.name}
              Icon={navItem.icon}
              active={navItem.active}
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
