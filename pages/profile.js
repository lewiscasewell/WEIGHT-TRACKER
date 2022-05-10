import { Grid } from '@chakra-ui/react'
import { CheckIcon, LogoutIcon, PencilAltIcon } from '@heroicons/react/outline'
import { startOfDay } from 'date-fns'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { userState, weightsState } from '../atoms/userAtom'
import Header from '../components/Header'
import MainContent from '../components/MainContent'
import ProfileEditNumber from '../components/ProfileEditNumber'
import ProfileListbox from '../components/ProfileListbox'
import { auth, db } from '../firebase'

export default function Profile() {
  const [user, setUser] = useRecoilState(userState)
  const [value, setValue] = useRecoilState(dateState)
  const [weights, setWeights] = useRecoilState(weightsState)
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const [isEditHeight, setIsEditHeight] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) {
      return router.push('/login')
    }
    getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
      }
    })
    setValue(startOfDay(new Date()))
  }, [])

  const handleSignout = async () => {
    signOut(auth)
    router.push('/login')
  }

  const genderOptions = [{ option: 'Male' }, { option: 'Female' }]
  const unitOptions = [{ option: 'kg' }, { option: 'lb' }]
  const activityOptions = [
    { option: 'Basal Metabolic rate' },
    { option: 'Sedentary: Little or no exercise' },
    { option: 'Light: Exercise 1-3 times/week' },
    { option: 'Moderate: exercise 4-5 times/week' },
    { option: 'Active: Daily exercise or intense exercise 3-4 times/week' },
    { option: 'Very Active: intense exercise 6-7 time/week' },
    { option: 'Extra Active: very intense exercise daily, or physical job' },
  ]
  const goalOptions = [
    { option: 'Extreme cut' },
    { option: 'Cut' },
    { option: 'Slow cut' },
    { option: 'Maintain' },
    { option: 'Slow bulk' },
    { option: 'Bulk' },
    { option: 'Extreme bulk' },
  ]

  return (
    <div>
      {/* <Head>
        <title>WEIGHT-TRACKER / profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <MainContent>
        <Header />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="">
              <h2 className="text-2xl">Hi, {user?.name}</h2>
              <span className="text-xs text-slate-400">
                Joined{' '}
                <Moment format="MMM DD yyyy">{user?.createdAt.toDate()}</Moment>
              </span>
            </div>
          </div>

          <div className="mt-5">
            <h2>
              You have logged {weights?.length}{' '}
              {weights?.length == 1 ? 'weight' : 'weights'} with this app! 🙌
            </h2>
          </div>

          <div className="mt-5 rounded-md bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Personal Details</h2>
            </div>
            <div className="flex flex-col space-y-2 p-2 text-lg sm:text-xl">
              <div className="flex items-center justify-between">
                <label>Gender</label>
                <ProfileListbox value={genderOptions} />
              </div>

              <div className="flex items-center justify-between">
                <label>Unit</label>
                <ProfileListbox value={unitOptions} />
              </div>

              <div className="flex h-[48px] items-center justify-between">
                <label>Height</label>
                <ProfileEditNumber value={180} unit={'cm'} />
              </div>

              <div className="flex items-center justify-between">
                <label>Activity level</label>
                <ProfileListbox value={activityOptions} />
              </div>

              <div className="flex h-[48px] items-center justify-between">
                <label>Target weight</label>
                <ProfileEditNumber value={78} unit={'kg'} />
              </div>

              <div className="flex items-center justify-between">
                <label>Goal</label>
                <ProfileListbox value={goalOptions} />
              </div>
            </div>
          </div>
          <div className="mt-5 flex w-full items-center justify-center">
            <button
              className=" flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
              onClick={handleSignout}
            >
              Sign Out
              <LogoutIcon className="ml-2 h-5" />
            </button>
          </div>
        </div>
      </MainContent>
    </div>
  )
}

// export async function getServerSideProps(context) {
//   const providers = await getProviders()
//   const session = await getSession(context)

//   return {
//     props: {
//       providers,
//       session,
//     },
//   }
// }
