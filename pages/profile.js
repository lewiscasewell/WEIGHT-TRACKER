import { async } from '@firebase/util'
import { LogoutIcon } from '@heroicons/react/outline'
import { format, startOfDay } from 'date-fns'
import { signOut } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'

import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { editProfileModalState } from '../atoms/modalAtom'
import {
  activityState,
  birthDateState,
  dobState,
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
  // const [dob, setDob] = useRecoilState(dobState)
  const [birthDate, setBirthDate] = useRecoilState(birthDateState)
  const [isEditBirthDate, setIsEditBirthDate] = useState(false)
  const [newBirthDate, setNewBirthDate] = useState(null)

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
        setBirthDate(docSnap.data().birthDate.toDate().getTime())
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

  const current = new Date().toISOString().split('T')[0]

  const handleSaveNewBirthDate = async () => {
    if (newBirthDate) {
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
        birthDate: Timestamp.fromDate(new Date(newBirthDate)),
      })
      window.location.reload(false)
      setIsEditBirthDate(false)
      setNewBirthDate(null)
    }
  }

  const DetailWrapper = ({ children }) => {
    return <div className="flex items-center justify-between">{children}</div>
  }

  return (
    <div>
      {/* <Head>
        <title>WEIGHT-TRACKER / profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <ProfileEditModal />
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

          <div className="mt-5 rounded-md bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Personal Details</h2>
              <button
                className="flex w-fit items-center rounded-md border-2 border-slate-700 py-1 px-2 text-slate-700 transition-colors ease-in hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  setModalOpen(true)
                }}
              >
                Edit profile
              </button>
            </div>
            <div className="flex flex-col space-y-2 p-2 text-lg">
              <DetailWrapper>
                <label>Gender</label>
                <label>{!gender ? '-' : gender}</label>
              </DetailWrapper>
              {/* <DetailWrapper>
                <label>Unit</label>
                <label>{!unit ? '-' : unit}</label>
              </DetailWrapper> */}
              <DetailWrapper>
                <label>Height</label>
                <label>{!height ? '-' : height} cm</label>
              </DetailWrapper>
              <DetailWrapper>
                <label>Activity level</label>
                <label className="text-right">
                  {!activity ? '-' : activity}
                </label>
              </DetailWrapper>
              <DetailWrapper>
                <label>Target Weight</label>
                <label>{!targetWeight ? '-' : targetWeight} kg</label>
              </DetailWrapper>

              <div className="flex flex-col">
                <label>
                  Birth date -{' '}
                  <span
                    onClick={() => {
                      isEditBirthDate
                        ? handleSaveNewBirthDate()
                        : setIsEditBirthDate(true)
                    }}
                    className="cursor-pointer text-red-400 hover:underline"
                  >
                    {isEditBirthDate ? 'Save' : 'Edit'}
                  </span>
                </label>
                {!isEditBirthDate && (
                  <span>
                    {!birthDate
                      ? ''
                      : format(new Date(birthDate), 'dd/MM/yyyy')}
                  </span>
                )}
                {isEditBirthDate && (
                  <input
                    type="date"
                    max={current}
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                  />
                )}
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
