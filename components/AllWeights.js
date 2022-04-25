import { RefreshIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import AddWeight from './AddWeight'
import Weight from './Weight'
const { addDays, startOfDay } = require('date-fns')
import { useRecoilState } from 'recoil'
import { dateState, numberOfDaysBackState } from '../atoms/dateAtom'

const AllWeights = ({ scrollTop, myRef, onScroll, weights }) => {
  // constants for building all dates to scroll through
  const [_, setValue] = useRecoilState(dateState)
  const [numberOfDaysBack, setNumberOfDaysBack] = useRecoilState(
    numberOfDaysBackState
  )
  const endOfLongDate = new Date()
  let priorDate = startOfDay(
    new Date(
      new Date().setDate(startOfDay(new Date()).getDate() - numberOfDaysBack)
    )
  )

  const distanceBetweenInDays = Math.ceil(
    (endOfLongDate.getTime() - priorDate.getTime()) / (1000 * 3600 * 24)
  )
  let longPeriod = [...Array(+distanceBetweenInDays)]
    .map((_, idx) => addDays(priorDate, idx))
    .reverse()

  // Creating an array of objects for dates and weights.
  // Start with creating an array of objects with a date and empty weights.
  // Then replacing the object.weight value if there is a weight for that date.
  let weightsOnlyArray = []
  weights.map((i) => {
    weightsOnlyArray.push(Number(i.weight))
  })
  weightsOnlyArray.reverse()
  const getMovingAverage = (numbers = []) => {
    const result = []
    let sum = 0
    let count = 0
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i]
      sum += num
      count++
      const curr = sum / count
      result[i] = Number(curr.toFixed(1))
    }
    return result
  }
  let movingAverageWeights = getMovingAverage(weightsOnlyArray).reverse()
  let set = new Set()
  let weightsDates = weights.map((i, idx) => ({
    date: i.date.toDate().getTime(),
    weight: Number(i.weight),
    avgWeight: movingAverageWeights[idx],
    id: i.id,
  }))
  let longPeriodOfWeights = longPeriod.map((date) => ({
    date: date.getTime(),
    weight: null,
    avgWeight: null,
    id: null,
  }))

  let mergedWeightsDates = [...weightsDates, ...longPeriodOfWeights]
  let uniqueArray = mergedWeightsDates.filter((item) => {
    if (!set.has(item.date)) {
      set.add(item.date)
      return true
    }
    return false
  }, set)
  const sortedArray = uniqueArray.sort((a, b) => b.date - a.date)
  sortedArray.splice(
    +distanceBetweenInDays,
    sortedArray.length - distanceBetweenInDays
  )

  useEffect(() => {
    longPeriod = [...Array(+distanceBetweenInDays)]
      .map((_, idx) => addDays(priorDate, idx))
      .reverse()
    longPeriodOfWeights = longPeriod.map((date) => ({
      date: date.getTime(),
      weight: null,
    }))
  }, [priorDate, dateState])

  useEffect(() => {
    if (typeof window === 'object') {
      longPeriod.forEach((i, idx) => {
        const heightOfElement = document
          .getElementById(idx)
          .getBoundingClientRect().height
        const pos = document.getElementById(idx).getBoundingClientRect().top
        if (pos >= heightOfElement && pos <= 179) {
          setValue(longPeriod[idx])
        }
      })
    }
    if (scrollTop <= 1000) {
      setNumberOfDaysBack(90)
    }
  }, [scrollTop])

  return (
    <div
      ref={myRef}
      onScroll={onScroll}
      className="divide-y-2 overflow-y-scroll"
    >
      {sortedArray.map((i, idx) =>
        i.weight ? (
          <Weight
            id={`${idx}`}
            key={idx}
            date={new Date(i.date)}
            weight={i.weight}
            weightId={i.id}
            movingAverageWeight={i.avgWeight}
          />
        ) : (
          <AddWeight id={`${idx}`} key={idx} date={new Date(i.date)} />
        )
      )}
      <div className="flex h-[70px] w-full items-center justify-center">
        <button
          onClick={() => setNumberOfDaysBack(numberOfDaysBack + 90)}
          className="flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
        >
          <RefreshIcon className="mr-2 h-5" />
          Load More
        </button>
      </div>
      <div className="h-[80px] w-full sm:hidden" />
    </div>
  )
}

export default AllWeights
