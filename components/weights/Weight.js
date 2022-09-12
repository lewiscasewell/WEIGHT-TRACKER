import React from 'react'
import Moment from 'react-moment'
import WeightOptionsMenu from './WeightOptionsMenu'

const Weight = ({ date, id, weight, weightId, movingAverageWeight = '-' }) => {
  return (
    <div
      id={id}
      className="flex h-[62px] w-full items-center justify-between px-4 py-1"
    >
      <h2 className="w-2/7">
        <Moment format={'MMM DD'}>{date}</Moment>
      </h2>
      <h2 className="w-2/7">{weight} kg</h2>
      <h2 className="w-2/7">{movingAverageWeight} kg</h2>
      <div>
        <WeightOptionsMenu date={date} weightId={weightId} />
      </div>
    </div>
  )
}

export default Weight
