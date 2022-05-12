import { LogoutIcon } from '@heroicons/react/outline'
import { startOfDay } from 'date-fns'
import { signOut } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { editProfileModalState } from '../atoms/modalAtom'
import {
  activityState,
  genderState,
  goalState,
  heightState,
  targetWeightState,
  unitState,
  userState,
  weightsState,
} from '../atoms/userAtom'
import Header from '../components/Header'
import MainContent from '../components/MainContent'
import ProfileEditModal from '../components/ProfileEditModal'
import { auth, db } from '../firebase'

export default function Profile() {
  const [user, setUser] = useRecoilState(userState)
  const [value, setValue] = useRecoilState(dateState)
  const [weights, setWeights] = useRecoilState(weightsState)
  const [loadingWeights, setLoadingWeights] = useState(false)
  const router = useRouter()
  const [modalOpen, setModalOpen] = useRecoilState(editProfileModalState)
  const [gender, setGender] = useRecoilState(genderState)
  const [unit, setUnit] = useRecoilState(unitState)
  const [activity, setActivity] = useRecoilState(activityState)
  const [goal, setGoal] = useRecoilState(goalState)
  const [height, setHeight] = useRecoilState(heightState)
  const [targetWeight, setTargetWeight] = useRecoilState(targetWeightState)

  useEffect(async () => {
    if (!auth.currentUser) {
      return router.push('/login')
    }
    await getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
        setGender(docSnap.data().gender)
        setUnit(docSnap.data().unit)
        setActivity(docSnap.data().activity)
        setGoal(docSnap.data().goal)
        setHeight(docSnap.data().height)
        setTargetWeight(docSnap.data().targetWeight)
      }
    })

    setValue(startOfDay(new Date()))
    const weightsRef = collection(db, 'Weights', auth.currentUser.uid, 'Weight')
    const q = query(weightsRef, orderBy('date', 'desc'))

    const unsub = onSnapshot(q, (querySnapshot) => {
      let weights = []
      querySnapshot.forEach((doc) => {
        weights.push(Object.assign(doc.data(), { id: doc.id }))
      })
      setWeights(weights)
      setLoadingWeights(false)
    })
    return () => unsub()
  }, [])

  const handleSignout = async () => {
    signOut(auth)
    router.push('/login')
  }

  return (
    <div>
      {/* <Head>
        <title>WEIGHT-TRACKER / profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <MainContent>
        <Header />
        <ProfileEditModal />
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
              <button
                onClick={() => {
                  setModalOpen(true)
                }}
              >
                Edit profile
              </button>
            </div>
            <div className="flex flex-col space-y-2 p-2 text-lg">
              <div className="flex items-center justify-between">
                <label>Gender</label>
                <span>{gender}</span>
              </div>

              <div className="flex items-center justify-between">
                <label>Unit</label>
                <label>{unit}</label>
              </div>
              <div className="flex items-center justify-between">
                <label>Height</label>
                <label>{height}</label>
              </div>
              <div className="flex items-center justify-between">
                <label>Activity level</label>
                <label>{activity}</label>
              </div>
              <div className="flex items-center justify-between">
                <label>Target Weight</label>
                <label>{targetWeight}</label>
              </div>
              <div className="flex items-center justify-between">
                <label>Goal</label>
                <label>{goal}</label>
              </div>

              {/*  <div className="flex h-[48px] items-center justify-between">
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
              </div> */}
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
