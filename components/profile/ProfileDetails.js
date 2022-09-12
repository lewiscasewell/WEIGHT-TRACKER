import { format } from 'date-fns'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { auth, db } from '../../firebase'
import useUser from '../../hooks/useUser'
import ActitiyLevelTooltip from '../ui/ActivityLevelToolTip'

const Detail = ({ title, value = '-', children }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center">
        {title}
        {children}
      </label>
      <label>{value === '' ? '-' : value}</label>
    </div>
  )
}

const BirthDateComponent = () => {
  const {
    user: { birthDate },
  } = useUser()
  const current = new Date().toISOString().split('T')[0]
  const [isEditBirthDate, setIsEditBirthDate] = useState(false)
  const [newBirthDate, setNewBirthDate] = useState(null)
  const router = useRouter()

  const handleSaveNewBirthDate = async () => {
    if (newBirthDate) {
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
        birthDate: Timestamp.fromDate(new Date(newBirthDate)),
      })
      router.reload()
      setIsEditBirthDate(false)
      setNewBirthDate(null)
    }
  }

  return (
    <>
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
          {isEditBirthDate && (
            <span
              onClick={() => {
                setIsEditBirthDate(false)
              }}
              className="ml-4 cursor-pointer text-red-400 hover:underline"
            >
              Cancel
            </span>
          )}
        </label>
        {!isEditBirthDate && (
          <span>
            {!birthDate
              ? ''
              : format(new Date(birthDate.toDate()), 'dd/MM/yyyy')}
          </span>
        )}
        {isEditBirthDate && (
          <input
            type="date"
            className="peer h-10 w-full border-b-2 border-gray-300 bg-transparent text-gray-900 placeholder-transparent focus:border-red-400 focus:outline-none"
            max={current}
            value={newBirthDate}
            onChange={(e) => setNewBirthDate(e.target.value)}
          />
        )}
      </div>
    </>
  )
}

const ProfileDetails = () => {
  const {
    user: { gender, height, activity, targetWeight, birthDate },
  } = useUser()
  return (
    <>
      <Detail title="Gender" value={gender} />
      <Detail title="Height" value={height} />
      <Detail title="Activity level" value={activity}>
        <span className="ml-2">
          <ActitiyLevelTooltip />
        </span>
      </Detail>
      <Detail title="Target weight" value={targetWeight} />
      <BirthDateComponent birthDate={birthDate} />
    </>
  )
}

export default ProfileDetails
