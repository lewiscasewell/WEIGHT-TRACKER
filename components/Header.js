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

  const handleUnitChange = async (e) => {
    await updateDoc(doc(db, 'Users', user.uid), {
      unit: e.target.value,
    })
  }

  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white/30 p-2 backdrop-blur-lg">
      <h2 className="font-bold">
        {router.asPath === '/' ? 'Weights' : title.join('')}
      </h2>
      <div className="">
        {/* <select
          id="unit"
          className="rounded-md bg-transparent px-4 py-1 outline-none hover:bg-slate-100"
          onChange={(e) => handleUnitChange(e)}
          //   defaultValue={user.unit}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select> */}
      </div>
    </div>
  )
}

export default Header
