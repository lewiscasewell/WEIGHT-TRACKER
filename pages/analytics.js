import { createTheme, Slider, ThemeProvider } from '@mui/material'
const theme = createTheme({
  palette: {
    primary: { main: '#f87171' },
  },
})
import { intervalToDuration, startOfDay } from 'date-fns'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import {
  activityState,
  birthDateState,
  genderState,
  goalState,
  heightState,
  lastWeightState,
  targetWeightState,
  unitState,
  userState,
  weightsState,
} from '../atoms/userAtom'
import Header from '../components/Header'
import MainContent from '../components/MainContent'
import { auth, db } from '../firebase'

export default function Analytics() {
  const [weights, setWeights] = useRecoilState(weightsState)
  const [user, setUser] = useRecoilState(userState)
  const [lastWeight, setLastWeight] = useRecoilState(lastWeightState)
  const [value, setValue] = useRecoilState(dateState)
  const [gender, setGender] = useRecoilState(genderState)
  const [unit, setUnit] = useRecoilState(unitState)
  const [activity, setActivity] = useRecoilState(activityState)
  const [goal, setGoal] = useRecoilState(goalState)
  const [loadingWeights, setLoadingWeights] = useState(false)
  const [height, setHeight] = useRecoilState(heightState)
  const [targetWeight, setTargetWeight] = useRecoilState(targetWeightState)
  const [birthDate, setBirthDate] = useRecoilState(birthDateState)
  const [calories, setCalories] = useState()
  const [additionalCals, setAdditionalCals] = useRecoilState(goalState)
  const [goalEdited, setGoalEdited] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [fromTarget, setFromTarget] = useState(0)
  const [daysToTarget, setDaysToTarget] = useState(0)
  const router = useRouter()

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
        setBirthDate(docSnap.data().birthDate.toDate())
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
      setLastWeight(weights[0])
      setLoadingWeights(false)
    })
    return () => unsub()
  }, [])

  const handleSaveGoal = async () => {
    await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
      goal: additionalCals,
    })
    setGoalEdited(false)
  }

  const activityOptions = [
    'Basal Metabolic rate',
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very Active',
    'Extra Active',
  ]
  const activityIndex = activityOptions.indexOf(activity)
  const marks = [
    { value: -1000, label: 'Deficit' },
    { value: 0, label: 'Maintenance' },
    { value: 1000, label: 'Surplus' },
  ]

  useEffect(() => {
    calcCalories()

    if (targetWeight && weights.length >= 1) {
      if (targetWeight > Number(weights[0].weight)) {
        setFromTarget((targetWeight - Number(weights[0].weight)).toFixed(1))
        setProgressValue(
          (
            ((targetWeight - Number(weights[0].weight)) / targetWeight) *
            100
          ).toFixed(0)
        )
        if (additionalCals > 0) {
          setDaysToTarget(
            (
              ((targetWeight - Number(weights[0].weight)) * 7700) /
              additionalCals
            ).toFixed(0)
          )
        } else {
          setDaysToTarget(0)
        }
      }
      if (targetWeight < Number(weights[0].weight)) {
        setFromTarget((Number(weights[0].weight) - targetWeight).toFixed(1))
        setProgressValue(
          (
            ((Number(weights[0].weight) - targetWeight) /
              Number(weights[0].weight)) *
            100
          ).toFixed(0)
        )
        if (additionalCals < 0) {
          setDaysToTarget(
            (
              ((Number(weights[0].weight) - targetWeight) * 7700) /
              (0 - additionalCals)
            ).toFixed(0)
          )
        } else {
          setDaysToTarget(0)
        }
      }
    }
  }, [weights, additionalCals, goal])

  const calcCalories = () => {
    if (weights.length >= 1 && birthDate && height && gender && activity) {
      const age1 = intervalToDuration({
        start: birthDate,
        end: new Date(),
      }).years

      const multipliers = [1, 1.2, 1.375, 1.55, 1.725, 1.9]

      if (gender === 'Male') {
        const BMR =
          66.47 +
          13.75 * Number(weights[0].weight) +
          5.003 * Number(height) -
          6.755 * age1

        const calories =
          Number((BMR * multipliers[activityIndex]).toFixed(0)) +
          Number(additionalCals)

        setCalories(calories)
      }
      if (gender === 'Female') {
        const BMR =
          655.1 +
          9.563 * Number(weights[0].weight) +
          1.85 * Number(height) -
          4.676 * age1

        const calories =
          Number((BMR * multipliers[activityIndex]).toFixed(0)) +
          Number(additionalCals)

        setCalories(calories)
      }
    }
  }

  return (
    <div>
      <MainContent>
        <Header />
        {weights.length >= 1 && birthDate && height && gender && activity ? (
          <div className="overflow-y-scroll p-2">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-xl text-slate-500">Daily calorie target</h1>
              <h2 className="flex items-center text-center text-6xl text-slate-700">
                {calories}{' '}
              </h2>
              <p className="my-2 text-xs text-slate-400">
                {additionalCals === 0
                  ? 'Maintenance'
                  : additionalCals > 0
                  ? `${additionalCals} calorie surplus`
                  : `${0 - additionalCals} calorie deficit`}
              </p>
              <div className="mt-6 w-full px-10">
                <ThemeProvider theme={theme}>
                  <Slider
                    onChange={(e) => {
                      setAdditionalCals(e.target.value)
                      setGoalEdited(true)
                    }}
                    value={additionalCals}
                    min={-1000}
                    max={1000}
                    step={50}
                    marks={marks}
                    valueLabelDisplay="auto"
                    color="primary"
                    track={false}
                  />
                </ThemeProvider>
              </div>
              <div className="my-2 h-[40px]">
                {goalEdited && (
                  <button
                    className="flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
                    onClick={handleSaveGoal}
                  >
                    Save goal
                  </button>
                )}
              </div>
              <div>
                <div className="grid place-items-center bg-white">
                  <div className="flex h-[80px] w-full items-center justify-between">
                    <div className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-full bg-slate-100 p-4">
                      <h1 className="text-sm text-slate-500">Current</h1>
                      <h1 className="text-2xl text-slate-700">
                        {weights[0].weight}kg
                      </h1>
                    </div>
                    <div className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-full bg-slate-100 p-4">
                      <h1 className="text-sm text-slate-500">Target</h1>
                      <h1 className="text-2xl text-slate-700">
                        {targetWeight}kg
                      </h1>
                    </div>
                  </div>
                  <div
                    style={{
                      background: `conic-gradient(#f87171 ${
                        100 - progressValue
                      }%, #fee2e2 0 ${progressValue}%)`,
                    }}
                    className={`relative grid h-[250px] w-[250px] place-items-center rounded-full bg-slate-500`}
                  >
                    <div className="absolute flex h-[84%] w-[84%] flex-col place-items-center justify-center rounded-full bg-white">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl text-slate-700">{`${fromTarget}kg`}</span>
                        <span className="text-xs text-slate-400">
                          from target weight
                        </span>
                      </div>
                      {daysToTarget !== 0 && (
                        <div className="mt-3 flex flex-col items-center">
                          <span className="text-xl text-slate-600">{`~${daysToTarget} days`}</span>
                          <span className="text-xs text-slate-400">
                            to reach target weight
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[100px]"></div>
            </div>
          </div>
        ) : (
          <div className="p-2">
            Finish all profile fields and log at least one weight to see
            analytics.
          </div>
        )}
      </MainContent>
    </div>
  )
}
