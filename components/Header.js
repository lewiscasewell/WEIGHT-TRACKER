import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/userAtom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Header = () => {
  const [user, setUser] = useRecoilState(userState)
  const router = useRouter()
  let title
  if (router.asPath !== '/') {
    title = router.asPath.split('').slice(2)
    title.unshift(router.asPath.split('')[1].toUpperCase())
  }

  // const handleUnitChange = async (e) => {
  //   await updateDoc(doc(db, 'Users', user.uid), {
  //     unit: e.target.value,
  //   })
  // }

  return (
    <div className="sticky top-0 z-10 flex w-full bg-white/30 p-2 backdrop-blur-lg">
      <h2 className="px-2 font-bold">
        {router.asPath === '/' ? 'Weights' : title.join('')}
      </h2>
    </div>
  )
}

export default Header
