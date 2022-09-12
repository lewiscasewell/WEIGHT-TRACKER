import { RefreshIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import AddWeight from './AddWeight'
import Weight from './Weight'
import { addDays, startOfDay } from 'date-fns'
import { useRecoilState } from 'recoil'
import { dateState, numberOfDaysBackState } from '../../atoms/dateAtom'
import WeightSkeleton from './WeightSkeleton'
import Button from '../ui/Button'

const AllWeights = ({
  scrollTop,
  myRef,
  onScroll,
  weights,
  loadingWeights,
}) => {
  const [_, setValue] = useRecoilState(dateState)
  const [numberOfDaysBack, setNumberOfDaysBack] = useRecoilState(
    numberOfDaysBackState
  )
  const endDate = startOfDay(new Date())
  const startDate = startOfDay(
    new Date(
      new Date().setDate(startOfDay(new Date()).getDate() - numberOfDaysBack)
    )
  )

  const numberOfDaysBetweenStartAndEnd =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) +
    1

  const arrayOfAllDatesToRender = [...Array(+numberOfDaysBetweenStartAndEnd)]
    .map((_, idx) => addDays(startDate, idx))
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
  let longPeriodOfWeights = arrayOfAllDatesToRender.map((date) => ({
    date: date.getTime(),
    weight: null,
    avgWeight: null,
    id: null,
  }))

  const mergedWeightsDates = [...weightsDates, ...longPeriodOfWeights]
  const uniqueArray = mergedWeightsDates.filter((item) => {
    if (!set.has(item.date)) {
      set.add(item.date)
      return true
    }
    return false
  }, set)
  const sortedArray = uniqueArray.sort((a, b) => b.date - a.date)
  sortedArray.splice(
    +numberOfDaysBetweenStartAndEnd,
    sortedArray.length - numberOfDaysBetweenStartAndEnd
  )

  useEffect(() => {
    arrayOfAllDatesToRender = [...Array(+numberOfDaysBetweenStartAndEnd)]
      .map((_, idx) => addDays(startDate, idx))
      .reverse()
    longPeriodOfWeights = arrayOfAllDatesToRender.map((date) => ({
      date: date.getTime(),
      weight: null,
    }))
  }, [startDate, dateState])

  useEffect(() => {
    if (typeof window === 'object') {
      arrayOfAllDatesToRender.forEach((i, idx) => {
        const heightOfElement = document
          .getElementById(idx)
          ?.getBoundingClientRect().height
        const pos = document.getElementById(idx)?.getBoundingClientRect().top
        if (pos >= heightOfElement && pos <= 179) {
          setValue(arrayOfAllDatesToRender[idx])
        }
      })
    }
    if (scrollTop <= 1000) {
      setNumberOfDaysBack(90)
    }
  }, [scrollTop])

  return (
    <React.Fragment>
      <div
        ref={myRef}
        onScroll={onScroll}
        className="divide-y-2 overflow-y-scroll"
      >
        {loadingWeights &&
          [...Array(20)].map((i, idx) => <WeightSkeleton key={idx} />)}
        {!loadingWeights &&
          sortedArray.map((i, idx) =>
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
        <div className="flex h-[70px] w-full items-center justify-center sm:mb-0">
          <Button onClick={() => setNumberOfDaysBack(numberOfDaysBack + 90)}>
            <RefreshIcon className="mr-2 h-5" />
            Load More
          </Button>
        </div>
      </div>
    </React.Fragment>
  )
}

export default AllWeights
