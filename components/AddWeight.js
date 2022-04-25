import React from 'react'
import { PlusCircleIcon } from '@heroicons/react/outline'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { dateState } from '../atoms/dateAtom'

const AddWeight = ({ date, id }) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const [value, setValue] = useRecoilState(dateState)

  return (
    <div
      id={id}
      onClick={() => {
        setModalOpen(true)
        setValue(date)
      }}
      className="flex h-[62px] w-full items-center px-4 py-1"
    >
      <h2 className="mr-6 w-[70px] text-slate-400">
        <Moment format={'MMM DD'}>{date}</Moment>
      </h2>
      <div className="flex w-full items-center justify-center p-2 text-slate-400 outline-dashed outline-2 outline-slate-300 transition-colors ease-in hover:cursor-pointer hover:text-red-400">
        Add Weight <PlusCircleIcon className="ml-2 h-5" />
      </div>
    </div>
  )
}

export default AddWeight
