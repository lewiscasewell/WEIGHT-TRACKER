import {
  ArrowLeftIcon,
  MinusSmIcon,
  PlusSmIcon,
  XIcon,
} from '@heroicons/react/outline'
import { format, startOfDay } from 'date-fns'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { modalState } from '../atoms/modalAtom'
import { lastWeightState, userState, weightsState } from '../atoms/userAtom'
import { useRouter } from 'next/router'

const Input = () => {
  const [input, setInput] = useState(70)
  const [isMin, setIsMin] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const [weightIsEdited, setWeightIsEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [indexOfWeightForSelectedDate, setIndexOfWeightForSelectedDate] =
    useState()

  const [date, setDate] = useRecoilState(dateState)
  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const [lastWeight, setLastWeight] = useRecoilState(lastWeightState)
  const [weights, setWeights] = useRecoilState(weightsState)
  const [user, setUser] = useRecoilState(userState)

  const router = useRouter()

  const transformWeightConversion = (weight) => {
    if (user.unit === 'kg') return weight
    if (user.unit === 'lb') return (weight * 2.20462).toFixed(1)
  }

  function validateOnBlur(e) {
    setInput((+e.target.value).toFixed(1))

    if (+e.target.value <= 2.0) {
      setInput(2.0)
      setIsMin(true)
    }
    if (+e.target.value >= 999) {
      setInput(999)
      setIsMax(true)
    }
    if (+e.target.value >= 2.0 && +e.target.value <= 999) {
      setIsMin(false)
      setIsMax(false)
    }
  }

  useEffect(() => {
    const weightInput = document.getElementById('weight')
    weightInput.focus()
    // set the date picker's maximum date as today's date
    const dateTimePicker = document.getElementById('dateTimePicker')
    dateTimePicker.max = new Date().toISOString().split('T')[0]
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    await addDoc(collection(db, 'Weights', user.uid, 'Weight'), {
      weight: user.unit === 'kg' ? input : (input / 2.20462).toFixed(1),
      date,
    })
    router.push('/')
    setLoading(false)
    setWeightIsEdited(false)
    setModalOpen(false)
  }

  useEffect(() => {
    let weightsDates = weights.map((i) => startOfDay(i.date.toDate()).getTime())

    setIndexOfWeightForSelectedDate(
      weightsDates.indexOf(startOfDay(date).getTime())
    )

    setInput(
      weights[indexOfWeightForSelectedDate]
        ? weights[indexOfWeightForSelectedDate].weight
        : lastWeight
        ? lastWeight.weight
        : 70
    )

    indexOfWeightForSelectedDate == -1 ? setIsEdit(false) : setIsEdit(true)
  }, [date, indexOfWeightForSelectedDate, isEdit])

  const handleChangeInputDate = (e) => {
    setDate(startOfDay(e.target.valueAsDate))
  }

  const handleEdit = async () => {
    setLoading(true)
    await updateDoc(
      doc(
        db,
        'Weights',
        user.uid,
        'Weight',
        weights[indexOfWeightForSelectedDate].id
      ),
      {
        weight: user.unit === 'kg' ? input : (input / 2.20462).toFixed(1),
      }
    )
    router.push('/')
    setLoading(false)
    setWeightIsEdited(false)
    setModalOpen(false)
  }

  return (
    <div className="h-screen w-full max-w-md flex-col rounded-2xl bg-white p-2 sm:h-[280px] sm:w-fit sm:max-w-lg  sm:shadow-lg">
      <div className="h-[70px] w-full">
        <button
          onClick={() => setModalOpen(false)}
          className="flex items-center justify-center rounded-full p-2 transition-colors ease-in hover:bg-slate-100 "
        >
          <XIcon className="hidden h-5 sm:inline" />
          <ArrowLeftIcon className="inline h-5 sm:hidden" />
        </button>
      </div>
      <div className="mx-4 flex max-w-sm items-center justify-between space-x-3 sm:max-w-xl">
        <button
          onClick={() => {
            if (isMax) {
              setIsMax(false)
            }
            if (!isMin) {
              setInput((Number(input) - 0.1).toFixed(1))
              setWeightIsEdited(true)
            }
            if (Number(input) <= 2.1) {
              setIsMin(true)
            }
          }}
          className={`flex h-[36px] w-[36px] ${
            isMin
              ? 'cursor-not-allowed bg-slate-300 hover:bg-slate-400'
              : 'cursor-pointer bg-red-400 hover:bg-red-300'
          } items-center justify-center rounded-full font-bold text-white transition ease-in sm:h-[44px] sm:w-[44px]`}
        >
          <MinusSmIcon className="h-4 sm:h-6" />
        </button>
        <div className="flex items-center">
          <input
            type="number"
            id="weight"
            step="0.1"
            precision={1}
            onBlur={(e) => {
              validateOnBlur(e)
            }}
            value={input}
            className={`w-[2.5em] appearance-none bg-transparent text-center text-7xl ${
              weightIsEdited ? 'text-slate-700' : 'text-slate-300'
            } outline-none sm:w-[3em] sm:text-8xl`}
            onChange={(e) => {
              setInput(e.target.value)
              setWeightIsEdited(true)
            }}
            max={999}
            min={2}
          />
          <span>{user.unit.toUpperCase()}</span>
        </div>
        <button
          onClick={() => {
            if (isMin) {
              setIsMin(false)
            }
            if (!isMax) {
              setInput((Number(input) + 0.1).toFixed(1))
              setWeightIsEdited(true)
            }
            if (Number(input) >= 999) {
              setIsMax(true)
            }
          }}
          className={`flex ${
            isMax
              ? 'cursor-not-allowed bg-slate-300 hover:bg-slate-400'
              : 'cursor-pointer bg-red-400 hover:bg-red-300'
          } h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full font-bold text-white transition ease-in sm:h-[44px] sm:w-[44px]`}
        >
          <PlusSmIcon className="h-4 sm:h-6" />
        </button>
      </div>

      <div className="mx-4 mt-4 flex justify-between">
        <input
          type="date"
          id="dateTimePicker"
          className="bg-transparent"
          onChange={(e) => {
            handleChangeInputDate(e)
          }}
          value={format(date, 'yyyy-MM-dd')}
        />
        <button
          onClick={() => {
            {
              isEdit ? handleEdit() : handleSubmit()
            }
          }}
          className="rounded-lg border-2 border-red-400 px-2 py-1 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
        >
          {isEdit ? 'Edit' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default Input
