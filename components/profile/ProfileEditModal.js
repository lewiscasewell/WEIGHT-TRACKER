import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import { doc, updateDoc } from 'firebase/firestore'
import { useRecoilState } from 'recoil'
import { editProfileModalState } from '../../atoms/modalAtom'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import ProfileListbox from './ProfileListbox'
import ActitiyLevelTooltip from '../ui/ActivityLevelToolTip'
import useUser from '../../hooks/useUser'
import { useRouter } from 'next/router'
import Button from '../ui/Button'

const ProfileEditModal = () => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useRecoilState(editProfileModalState)
  const {
    user: { gender, height, activity, targetWeight },
    loadingUser,
  } = useUser()

  const [profileEditState, setProfileEditState] = useState({
    gender,
    height,
    activity,
    targetWeight,
  })

  useEffect(() => {
    setProfileEditState({
      gender,
      height,
      activity,
      targetWeight,
    })
  }, [loadingUser, modalOpen])

  const handleSave = async () => {
    await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
      gender: profileEditState.gender || '',
      activity: profileEditState.activity || '',
      height: profileEditState.height || '',
      targetWeight: profileEditState.targetWeight || '',
    })
    router.reload()
  }

  const genderOptions = ['Male', 'Female']
  const activityOptions = [
    'Basal Metabolic rate',
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very Active',
    'Extra Active',
  ]

  return (
    modalOpen && (
      <React.Fragment>
        <div
          onClick={() => setModalOpen(false)}
          className="fixed z-50 flex min-h-screen min-w-full bg-white/30 backdrop-blur-sm"
        />
        <div
          onClick={() => {}}
          className="absolute z-50 flex w-full items-center justify-center bg-white sm:fixed sm:left-[50%] sm:top-[5%] sm:mt-[300px] sm:w-fit sm:translate-y-[-50%] sm:translate-x-[-50%] sm:bg-transparent"
        >
          <div className="h-screen w-full max-w-md flex-col rounded-2xl bg-white p-2 sm:h-full sm:w-[450px] sm:max-w-lg  sm:shadow-lg">
            <div className="flex h-[40px] w-full items-start justify-between">
              <button
                onClick={() => {
                  setModalOpen(false)
                }}
                className="flex items-center justify-center rounded-full p-2 transition-colors ease-in hover:bg-slate-100 "
              >
                <XIcon className="hidden h-5 sm:inline" />
                <ArrowLeftIcon className="inline h-5 sm:hidden" />
              </button>
              <Button className="mr-3" onClick={() => handleSave()}>
                Save
              </Button>
            </div>
            <div className="text-md flex flex-col space-y-5 p-2 sm:max-h-[450px] sm:overflow-scroll sm:text-lg">
              <div className="flex flex-col">
                <label className="ml-2">Gender</label>
                <ProfileListbox
                  options={genderOptions}
                  field={'gender'}
                  value={profileEditState.gender}
                  state={profileEditState}
                  setState={setProfileEditState}
                />
              </div>

              {/* <div className="flex flex-col">
                <label className="ml-2">Unit</label>
                <ProfileListbox value={unitOptions} state={unitState} />
              </div> */}

              <div className="flex flex-col">
                <label className="ml-2">Height (cm)</label>
                <input
                  className="rounded-lg bg-white py-2 pl-3 pr-10 shadow-md focus:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300"
                  type="number"
                  value={profileEditState.height}
                  onChange={(e) =>
                    setProfileEditState({
                      ...profileEditState,
                      height: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="ml-2 flex items-center">
                  Activity level
                  <span className="ml-2">
                    <ActitiyLevelTooltip />
                  </span>
                </label>

                <ProfileListbox
                  options={activityOptions}
                  field={'activity'}
                  value={profileEditState.activity}
                  state={profileEditState}
                  setState={setProfileEditState}
                />
              </div>

              <div className="flex flex-col">
                <label className="ml-2">Target weight (kg)</label>
                <input
                  className="rounded-lg bg-white py-2 pl-3 pr-10 shadow-md focus:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-red-300"
                  type="number"
                  value={profileEditState.targetWeight}
                  onChange={(e) =>
                    setProfileEditState({
                      ...profileEditState,
                      targetWeight: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  )
}

export default ProfileEditModal
