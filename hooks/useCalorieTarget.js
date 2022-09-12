import { intervalToDuration } from 'date-fns'
import { useEffect, useState } from 'react'
import useUser from './useUser'
import useWeights from './useWeights'

const activityOptions = [
  'Basal Metabolic rate',
  'Sedentary',
  'Light',
  'Moderate',
  'Active',
  'Very Active',
  'Extra Active',
]

export default function useCalorieTarget({ additionalCals }) {
  const [calories, setCalories] = useState()
  const [fromTarget, setFromTarget] = useState(0)
  const [daysToTarget, setDaysToTarget] = useState(0)

  const [progressValue, setProgressValue] = useState(0)
  const { lastWeight } = useWeights()
  const {
    user: { targetWeight, birthDate, height, gender, activity },
  } = useUser()

  const activityIndex = activityOptions.indexOf(activity)

  useEffect(() => {
    calcCalories()

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
  }, [additionalCals, activity])

  const calcCalories = () => {
    const ageInYears = intervalToDuration({
      start: birthDate.toDate(),
      end: new Date(),
    }).years

    const multipliers = [1, 1.2, 1.375, 1.55, 1.725, 1.9]

    if (gender === 'Male') {
      const BMR =
        66.47 +
        13.75 * Number(lastWeight.weight) +
        5.003 * Number(height) -
        6.755 * ageInYears

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
        4.676 * ageInYears

      const calories =
        Number((BMR * multipliers[activityIndex]).toFixed(0)) +
        Number(additionalCals)

      setCalories(calories)
    }
  }

  return { calories, fromTarget, daysToTarget, progressValue }
}
