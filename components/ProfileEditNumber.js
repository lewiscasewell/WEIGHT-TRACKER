import { CheckIcon, PencilAltIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

const ProfileEditNumber = ({ value, unit }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [val, setVal] = useState(value)
  const handleChange = (e) => {
    setVal(e.target.value)
  }
  return (
    <div className="flex h-[44px] w-[180px] items-center justify-between rounded-lg bg-white py-2 pl-3 pr-2 shadow-md">
      {!isEdit && (
        <span className="block truncate text-slate-400">
          {value} {unit}
        </span>
      )}
      {isEdit && (
        <input
          type="number"
          className="w-[100px]"
          value={val}
          onChange={(e) => handleChange(e)}
        />
      )}

      <div
        className="flex cursor-pointer items-center"
        onClick={() => {
          setIsEdit(!isEdit)
          console.log(isEdit)
        }}
      >
        {!isEdit && (
          <PencilAltIcon
            className="h-5 w-5 text-slate-400"
            aria-hidden="true"
          />
        )}
        {isEdit && (
          <CheckIcon className="h-5 w-5 text-slate-900" aria-hidden="true" />
        )}
      </div>
    </div>
  )
}

export default ProfileEditNumber
