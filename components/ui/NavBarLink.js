import React from 'react'
import Link from 'next/link'

const NavBarLink = ({ Icon, text, active }) => {
  return (
    <Link
      href={`/${text.toLowerCase() == 'weights' ? '' : text.toLowerCase()}`}
    >
      <div
        className={`hoverAnimation ${
          active ? 'font-bold text-red-400' : 'text-slate-400'
        } flex items-center justify-center space-x-3 text-xl  lg:justify-start `}
      >
        <Icon className="h-7" />
        <span className="hidden lg:flex">{text}</span>
      </div>
    </Link>
  )
}

export default NavBarLink
