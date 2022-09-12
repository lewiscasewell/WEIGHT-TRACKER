import { createTheme, Slider, ThemeProvider } from '@mui/material'
const theme = createTheme({
  palette: {
    primary: { main: '#f87171' },
  },
})
import { intervalToDuration, startOfDay } from 'date-fns'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import Header from '../components/ui/Header'
import Loading from '../components/ui/Loading'
import { auth, db } from '../firebase'
import useWeights from '../hooks/useWeights'
import useUser from '../hooks/useUser'
import Layout from '../components/layout'
import Button from '../components/ui/Button'

export default function Analytics() {
  const [value, setValue] = useRecoilState(dateState)
  const [calories, setCalories] = useState()
  const [goalEdited, setGoalEdited] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [fromTarget, setFromTarget] = useState(0)
  const [daysToTarget, setDaysToTarget] = useState(0)

  const { loadingWeights, weights, lastWeight } = useWeights()

  const {
    loadingUser,
    user: { gender, activity, goal, height, targetWeight, birthDate },
  } = useUser()
  const [additionalCals, setAdditionalCals] = useState(goal)
  useEffect(() => {
    setAdditionalCals(goal)
  }, [goal])

  useEffect(async () => {
    setValue(startOfDay(new Date()))
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
      if (targetWeight > Number(lastWeight.weight)) {
        setFromTarget((targetWeight - Number(lastWeight.weight)).toFixed(1))
        setProgressValue(
          (
            ((targetWeight - Number(lastWeight.weight)) / targetWeight) *
            100
          ).toFixed(0)
        )
        if (additionalCals > 0) {
          setDaysToTarget(
            (
              ((targetWeight - Number(lastWeight.weight)) * 7700) /
              additionalCals
            ).toFixed(0)
          )
        } else {
          setDaysToTarget(0)
        }
      }
      if (targetWeight < Number(lastWeight.weight)) {
        setFromTarget((Number(lastWeight.weight) - targetWeight).toFixed(1))
        setProgressValue(
          (
            ((Number(lastWeight.weight) - targetWeight) /
              Number(lastWeight.weight)) *
            100
          ).toFixed(0)
        )
        if (additionalCals < 0) {
          setDaysToTarget(
            (
              ((Number(lastWeight.weight) - targetWeight) * 7700) /
              (0 - additionalCals)
            ).toFixed(0)
          )
        } else {
          setDaysToTarget(0)
        }
      }
    }
  }, [weights, additionalCals, goal, activity])

  const calcCalories = () => {
    if (weights.length >= 1 && birthDate && height && gender && activity) {
      const age1 = intervalToDuration({
        start: birthDate.toDate(),
        end: new Date(),
      }).years

      const multipliers = [1, 1.2, 1.375, 1.55, 1.725, 1.9]

      if (gender === 'Male') {
        const BMR =
          66.47 +
          13.75 * Number(lastWeight.weight) +
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
          9.563 * Number(lastWeight.weight) +
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
    <Layout>
      <Header />
      {loadingWeights && loadingUser && <Loading />}
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
                <Button onClick={handleSaveGoal}>Save goal</Button>
              )}
            </div>
            {targetWeight && (
              <div>
                <div className="grid place-items-center bg-white">
                  <div className="flex h-[80px] w-full items-center justify-between">
                    <div className="flex h-[110px] w-[110px] flex-col items-center justify-center rounded-full bg-slate-100 p-4">
                      <h1 className="text-sm text-slate-500">Current</h1>
                      <h1 className="text-2xl text-slate-700">
                        {lastWeight.weight}kg
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
            )}
            <div className="h-[100px]"></div>
          </div>
        </div>
      ) : (
        <div className="p-2">
          Finish all profile fields and log at least one weight to see
          analytics.
        </div>
      )}
    </Layout>
  )
}
