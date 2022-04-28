import React, { useState } from 'react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/userAtom'
import { Menu } from '@headlessui/react'
import { modalState } from '../atoms/modalAtom'
import WeightOptionsMenu from './WeightOptionsMenu'

const Weight = ({ date, id, weight, weightId, movingAverageWeight }) => {
  const [user, setUser] = useRecoilState(userState)
  const [optionsIsOpen, setOptionsIsOpen] = useState(false)

  const [modalOpen, setModalOpen] = useRecoilState(modalState)

  const transformWeightConversion = (weight) => {
    if (user.unit === 'kg') return weight
    if (user.unit === 'lb') return (weight * 2.20462).toFixed(1)
  }

  return (
    <div
      id={id}
      className="flex h-[62px] w-full items-center justify-between px-4 py-1"
    >
      <h2 className="w-2/7">
        <Moment format={'MMM DD'}>{date}</Moment>
      </h2>
      <h2 className="w-2/7">
        {transformWeightConversion(weight)} {user.unit}
      </h2>
      <h2 className="w-2/7">
        {transformWeightConversion(movingAverageWeight)} {user.unit}
      </h2>
      <div>
        {/* <button
          onClick={() => setOptionsIsOpen(!optionsIsOpen)}
          className="hoverAnimation w-1/7 flex h-[52px] w-[52px] items-center justify-center"
        >
          <DotsHorizontalIcon className="h-5" />
        </button> */}
        <WeightOptionsMenu date={date} weightId={weightId} />

        {/* {optionsIsOpen && (
          <React.Fragment>
            <div
              onClick={() => setOptionsIsOpen(false)}
              className="fixed z-50 flex min-h-screen min-w-full bg-white/30 backdrop-blur-sm"
            ></div>
            <div className="absolute right-5 z-50 mt-1 flex w-32 flex-col rounded bg-slate-50 hover:rounded">
              <a className="cursor-pointer rounded p-2 hover:bg-slate-100">
                Edit weight
              </a>
              <a className="cursor-pointer rounded p-2 hover:bg-slate-100">
                Delete weight
              </a>
            </div>
          </React.Fragment>
        )} */}
      </div>
    </div>
  )
}

export default Weight
