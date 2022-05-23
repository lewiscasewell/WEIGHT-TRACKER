import React from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/userAtom'
import WeightOptionsMenu from './WeightOptionsMenu'

const Weight = ({ date, id, weight, weightId, movingAverageWeight }) => {
  const [user, setUser] = useRecoilState(userState)

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
        <WeightOptionsMenu date={date} weightId={weightId} />
      </div>
    </div>
  )
}

export default Weight
