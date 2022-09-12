import React from 'react'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()
  let title
  if (router.asPath !== '/') {
    title = router.asPath.split('').slice(2)
    title.unshift(router.asPath.split('')[1].toUpperCase())
  }

  return (
    <div className="sticky top-0 z-10 flex w-full bg-white/30 p-2 backdrop-blur-lg">
      <h2 className="px-2 font-bold">
        {router.asPath === '/' ? 'Weights' : title.join('')}
      </h2>
    </div>
  )
}

export default Header
