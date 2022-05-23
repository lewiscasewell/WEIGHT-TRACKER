import React from 'react'
import { useRouter } from 'next/router'

const NavBarLink = ({ Icon, text, active }) => {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push(
          `/${text.toLowerCase() == 'weights' ? '' : text.toLowerCase()}`
        )
      }}
      className={`hoverAnimation ${
        active ? 'font-bold text-red-400' : 'text-slate-400'
      } flex items-center justify-center space-x-3 text-xl  lg:justify-start `}
    >
      <Icon className="h-7" />
      <span className="hidden lg:flex">{text}</span>
    </div>
  )
}

export default NavBarLink
