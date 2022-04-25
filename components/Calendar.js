import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  dateState,
  numberOfDaysBackState,
  priorDateState,
} from '../atoms/dateAtom'

const {
  startOfWeek,
  addDays,
  nextSunday,
  format,
  startOfYear,
  previousSaturday,
  startOfDay,
} = require('date-fns')

const Calendar = () => {
  const [noMoreNext, setNoMoreNext] = useState(false)
  const [value, setValue] = useRecoilState(dateState)

  // Constants for building weekly calendar scroll view
  const startDate = startOfWeek(value)
  const weekBeforeStartDate = previousSaturday(value)
  const weekNextStartDate = nextSunday(value)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const week = [...Array(7)].map((_, idx) => addDays(startDate, idx))

  const [numberOfDaysBack, setNumberOfDaysBack] = useRecoilState(
    numberOfDaysBackState
  )

  // constants for building all dates to scroll through
  const startOfLongDate = startOfYear(value)
  const endOfLongDate = new Date()

  var priorDate = startOfDay(
    new Date(
      new Date().setDate(startOfDay(new Date()).getDate() - numberOfDaysBack)
    )
  )

  //   const [priorDate, setPriorDate] = useRecoilState(priorDateState)

  const distanceBetweenInDays = Math.ceil(
    (endOfLongDate.getTime() - priorDate.getTime()) / (1000 * 3600 * 24)
  )

  let longPeriod = [...Array(+distanceBetweenInDays)]
    .map((_, idx) => addDays(priorDate, idx))
    .reverse()
  let longPeriodGetDate = longPeriod.map((i) => i.toLocaleDateString())

  useEffect(() => {
    longPeriod = [...Array(+distanceBetweenInDays)]
      .map((_, idx) => addDays(priorDate, idx))
      .reverse()
    longPeriodGetDate = longPeriod.map((i) => i.toLocaleDateString())
  }, [priorDate])

  function setToday() {
    // setValue(new Date())
    scrollToTopPositionOfDate(endOfLongDate)
  }
  function setWeekNext() {
    // setValue(weekNextStartDate)
    scrollToTopPositionOfDate(weekNextStartDate)
  }
  function setWeekBefore() {
    // setValue(weekBeforeStartDate)
    scrollToTopPositionOfDate(weekBeforeStartDate)
  }

  const scrollToTopPositionOfDate = (date) => {
    const selectedDate = date.toLocaleDateString().toString()
    const indexOfSelectedDate = longPeriodGetDate.indexOf(selectedDate)
    console.log(indexOfSelectedDate)
    const divToScrollIntoView = document.getElementById(indexOfSelectedDate)
    divToScrollIntoView.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    const datePickerId = document.getElementById('datePickerId')
    datePickerId.max = new Date().toISOString().split('T')[0]
    // datePickerId.min = startOfLongDate.toISOString().split('T')[0]

    if (startOfDay(new Date()).getTime() < weekNextStartDate.getTime()) {
      setNoMoreNext(true)
    }
  }, [priorDate, weekNextStartDate])

  useEffect(() => {
    scrollToTopPositionOfDate(value)
  }, [numberOfDaysBack])

  return (
    <React.Fragment>
      <div className="sticky top-0 z-10 w-full border-b-2 bg-white/30 backdrop-blur-lg">
        <div className="flex justify-between px-4 py-2">
          <input
            type="date"
            id="datePickerId"
            className="bg-transparent"
            value={format(value, 'yyyy-MM-dd')}
            onChange={(e) => {
              const date = e.target.valueAsDate
              if (date.getTime() <= priorDate.getTime()) {
                setNumberOfDaysBack(
                  Math.ceil(
                    (startOfDay(new Date().getTime()) - date.getTime()) /
                      (1000 * 3600 * 24)
                  ) + 90
                )
              }
              if (date.getTime() > priorDate.getTime()) {
                scrollToTopPositionOfDate(date)
              }

              setValue(date)
            }}
          />
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center justify-center"
              onClick={() => {
                setNoMoreNext(false)
                setWeekBefore()
              }}
            >
              <ChevronLeftIcon className="h-4" />
            </button>
            <button onClick={() => setToday()}>Today</button>
            <button
              className={`flex items-center justify-center ${
                noMoreNext ? 'text-slate-300' : ''
              }`}
              onClick={() => {
                if (new Date().getTime() >= weekNextStartDate.getTime()) {
                  setWeekNext()
                  setNoMoreNext(false)
                }
                if (new Date().getTime() < weekNextStartDate.getTime()) {
                  setNoMoreNext(true)
                }
              }}
            >
              <ChevronRightIcon className="h-4" />
            </button>
          </div>
        </div>
        <div id="grid" className="grid grid-cols-7 text-center">
          {week.map((i) =>
            i.getTime() <= new Date().getTime() ? (
              <div
                key={i}
                onClick={() => {
                  //   setValue(i)
                  scrollToTopPositionOfDate(i)
                }}
                className={`flex flex-col justify-center px-2 py-1 hover:cursor-pointer hover:bg-slate-200/30 hover:backdrop-blur-lg ${
                  value.getDay() === i.getDay()
                    ? 'border-b-2 border-red-400 bg-slate-200/30 backdrop-blur-lg'
                    : ''
                }`}
              >
                <span>{weekDays[i.getDay()]}</span>
                <span>{i.getDate()}</span>
              </div>
            ) : (
              <div
                key={i}
                className="flex flex-col justify-center px-2 py-1 text-slate-300 hover:cursor-not-allowed"
              >
                <div>{weekDays[i.getDay()]}</div>
                <div>{i.getDate()}</div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex w-full items-center justify-between bg-slate-100 px-4 py-1 text-center backdrop-blur-lg">
        <h2 className="w-2/7">Date</h2>
        <h2 className="w-2/7">Weight</h2>
        <h2 className="w-2/7 mr-12">Avg.</h2>
        <div className="w-1/7"> </div>
      </div>
    </React.Fragment>
  )
}

export default Calendar
