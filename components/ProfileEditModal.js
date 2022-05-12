import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import { set } from 'date-fns'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { editProfileModalState } from '../atoms/modalAtom'
import {
  activityState,
  genderState,
  goalState,
  heightState,
  targetWeightState,
  unitState,
  userState,
} from '../atoms/userAtom'
import { db } from '../firebase'
import ProfileEditNumber from './ProfileEditNumber'
import ProfileListbox from './ProfileListbox'

const ProfileEditModal = () => {
  const [modalOpen, setModalOpen] = useRecoilState(editProfileModalState)
  const user = useRecoilValue(userState)
  const gender = useRecoilValue(genderState)
  const unit = useRecoilValue(unitState)
  const [height, setHeight] = useRecoilState(heightState)
  const activity = useRecoilValue(activityState)
  const [targetWeight, setTargetWeight] = useRecoilState(targetWeightState)
  const goal = useRecoilValue(goalState)

  //   console.log(!gender ? '-' : gender)

  const handleSave = async () => {
    await updateDoc(doc(db, 'Users', user.uid), {
      gender,
      unit,
      activity,
      goal,
      height,
      targetWeight,
    })
  }

  const genderOptions = ['Male', 'Female']
  const unitOptions = ['kg']
  const activityOptions = [
    'Basal Metabolic rate',
    'Sedentary: Little or no exercise',
    'Light: Exercise 1-3 times/week',
    'Moderate: exercise 4-5 times/week',
    'Active: Daily exercise or intense exercise 3-4 times/week',
    'Very Active: intense exercise 6-7 time/week',
    'Extra Active: very intense exercise daily, or physical job',
  ]
  const goalOptions = [
    'Extreme cut',
    'Cut',
    'Slow cut',
    'Maintain',
    'Slow bulk',
    'Bulk',
    'Extreme bulk',
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
          className="absolute z-50 flex w-full items-center justify-center bg-white sm:fixed sm:left-[50%] sm:top-[5%] sm:mt-[25vh] sm:w-fit sm:translate-y-[-50%] sm:translate-x-[-50%] sm:bg-transparent"
        >
          <div className="h-screen w-full max-w-md flex-col rounded-2xl bg-white p-2 sm:h-[280px] sm:w-fit sm:max-w-lg  sm:shadow-lg">
            <div className="flex h-[70px] w-full items-start justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="flex items-center justify-center rounded-full p-2 transition-colors ease-in hover:bg-slate-100 "
              >
                <XIcon className="hidden h-5 sm:inline" />
                <ArrowLeftIcon className="inline h-5 sm:hidden" />
              </button>
              <button
                className="mr-3 flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
                onClick={() => {
                  handleSave()
                  setModalOpen(false)
                }}
              >
                Save
              </button>
            </div>
            <div className="flex flex-col space-y-5 p-2 text-lg">
              <div className="flex flex-col">
                <label className="ml-3">Gender</label>
                <ProfileListbox value={genderOptions} state={genderState} />
              </div>

              <div className="flex flex-col">
                <label className="ml-3">Unit</label>
                <ProfileListbox value={unitOptions} state={unitState} />
              </div>

              <div className="flex h-[48px] flex-col">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                {/* <ProfileEditNumber value={180} unit={'cm'} /> */}
              </div>

              <div className="flex flex-col">
                <label className="ml-3">Activity level</label>
                <ProfileListbox value={activityOptions} state={activityState} />
              </div>

              <div className="flex h-[48px] flex-col">
                <label>Target weight (kg)</label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
                {/* <ProfileEditNumber value={78} unit={'kg'} /> */}
              </div>

              <div className="flex flex-col">
                <label className="ml-3">Goal</label>
                <ProfileListbox value={goalOptions} state={goalState} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  )
}

export default ProfileEditModal
