import { LogoutIcon } from '@heroicons/react/outline'
import { startOfDay } from 'date-fns'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { editProfileModalState } from '../atoms/modalAtom'
import Header from '../components/ui/Header'
import Loading from '../components/ui/Loading'
import ProfileEditModal from '../components/profile/ProfileEditModal'
import { auth } from '../firebase'
import useUser from '../hooks/useUser'
import ProfileDetails from '../components/profile/ProfileDetails'
import Button from '../components/ui/Button'
import Layout from '../components/layout'

export default function Profile() {
  const [value, setValue] = useRecoilState(dateState)
  const router = useRouter()
  const [modalOpen, setModalOpen] = useRecoilState(editProfileModalState)

  const { loadingUser, user } = useUser()

  useEffect(async () => {
    setValue(startOfDay(new Date()))
    setModalOpen(false)
  }, [])

  const handleSignout = async () => {
    signOut(auth)
    router.push('/login')
  }

  return (
    <Layout>
      {loadingUser && <Loading />}
      {!loadingUser && (
        <>
          <ProfileEditModal />
          <Header />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="">
                <h2 className="text-2xl">Hi, {user?.name}</h2>
                <span className="text-xs text-slate-400">
                  Joined{' '}
                  <Moment format="MMM DD yyyy">
                    {user.createdAt.toDate()}
                  </Moment>
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-md bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Personal Details</h2>
                <Button onClick={() => setModalOpen(true)}>Edit profile</Button>
              </div>
              <div className="flex flex-col space-y-2 p-2 text-lg">
                {!loadingUser && <ProfileDetails user={user} />}
              </div>
            </div>
            <div className="mt-5 flex w-full items-center justify-center">
              <Button
                onClick={handleSignout}
                iconRight={<LogoutIcon className="ml-2 h-5" />}
              >
                Sign out
              </Button>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}
