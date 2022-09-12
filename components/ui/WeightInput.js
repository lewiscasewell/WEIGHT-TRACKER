import {
  ArrowLeftIcon,
  MinusSmIcon,
  PlusSmIcon,
  XIcon,
} from '@heroicons/react/outline'
import { format, startOfDay } from 'date-fns'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { useRecoilState } from 'recoil'
import { dateState } from '../../atoms/dateAtom'
import { modalState } from '../../atoms/modalAtom'
import { useRouter } from 'next/router'
import useWeights from '../../hooks/useWeights'
import useUser from '../../hooks/useUser'

const WeightInput = () => {
  const [weightInput, setWeightInput] = useState('70')
  const [isMin, setIsMin] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const [weightIsEdited, setWeightIsEdited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [indexOfWeightForSelectedDate, setIndexOfWeightForSelectedDate] =
    useState()

  const [date, setDate] = useRecoilState(dateState)
  console.log(date)

  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const { user, loadingUser } = useUser()

  const { weights, lastWeight, loadingWeights } = useWeights()

  const router = useRouter()

  function validateOnBlur(e) {
    setWeightInput((+e.target.value).toFixed(1))

    if (+e.target.value <= 2.0) {
      setWeightInput(2.0)
      setIsMin(true)
    }
    if (+e.target.value >= 999) {
      setWeightInput(999)
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

    return () => weightInput.blur()
  }, [lastWeight])

  const handleSubmit = async () => {
    setLoading(true)
    await addDoc(collection(db, 'Weights', auth.currentUser.uid, 'Weight'), {
      weight: weightInput,
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

    setWeightInput(
      weights[indexOfWeightForSelectedDate]
        ? weights[indexOfWeightForSelectedDate].weight
        : lastWeight
        ? lastWeight.weight
        : 70
    )

    indexOfWeightForSelectedDate == -1 ? setIsEdit(false) : setIsEdit(true)
  }, [date, weights, indexOfWeightForSelectedDate, isEdit])

  const handleChangeInputDate = (e) => {
    setDate(startOfDay(e.target.valueAsDate))
  }

  const handleEdit = async () => {
    setLoading(true)
    await updateDoc(
      doc(
        db,
        'Weights',
        auth.currentUser.uid,
        'Weight',
        weights[indexOfWeightForSelectedDate].id
      ),
      {
        weight: weightInput,
      }
    )
    router.push('/')
    setLoading(false)
    setWeightIsEdited(false)
    setModalOpen(false)
  }

  return (
    <div className="h-screen w-full max-w-md flex-col rounded-2xl bg-white p-2 sm:h-[280px] sm:w-fit sm:max-w-lg  sm:shadow-lg">
      <div className="flex h-[70px] w-full items-start">
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
              setWeightInput((Number(weightInput) - 0.1).toFixed(1))
              setWeightIsEdited(true)
            }
            if (Number(weightInput) <= 2.1) {
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
            value={weightInput}
            className={`w-[2.5em] appearance-none bg-transparent text-center text-7xl ${
              weightIsEdited ? 'text-slate-700' : 'text-slate-300'
            } outline-none sm:w-[3em] sm:text-8xl`}
            onChange={(e) => {
              setWeightInput(e.target.value)
              setWeightIsEdited(true)
            }}
            max={999}
            min={2}
          />
          <span>KG</span>
        </div>
        <button
          onClick={() => {
            if (isMin) {
              setIsMin(false)
            }
            if (!isMax) {
              setWeightInput((Number(weightInput) + 0.1).toFixed(1))
              setWeightIsEdited(true)
            }
            if (Number(weightInput) >= 999) {
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
            setModalOpen(false)
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

export default WeightInput
