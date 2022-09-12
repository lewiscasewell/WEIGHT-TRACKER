import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { dateState, numberOfDaysBackState } from '../../atoms/dateAtom'
import Header from '../ui/Header'
const {
  startOfWeek,
  addDays,
  nextSunday,
  format,
  previousSaturday,
  startOfDay,
} = require('date-fns')

const Calendar = () => {
  const [noMoreNext, setNoMoreNext] = useState(false)
  const [value, setValue] = useRecoilState(dateState)
  const [numberOfDaysBack, setNumberOfDaysBack] = useRecoilState(
    numberOfDaysBackState
  )

  // Constants for building Sunday - Saturday calendar bar
  const startOfWeekDate = startOfWeek(value)
  const weekBeforeStartDate = previousSaturday(value)
  const weekNextStartDate = nextSunday(value)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const week = [...Array(7)].map((_, idx) => addDays(startOfWeekDate, idx))

  // This is the beginning of the data that will be rendered on the weights page
  const startDate = startOfDay(
    new Date(
      new Date().setDate(startOfDay(new Date()).getDate() - numberOfDaysBack)
    )
  )
  // This is where the data will go up to - i.e. today's date
  const endDate = new Date()

  // The number of days between the start date and the end date
  const numberOfDaysBetweenStartAndEnd = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  )

  // array of all the dates to render, in the format of locale date string (in reverse so newest is first)
  const arrayOfAllDatesToRender = [...Array(+numberOfDaysBetweenStartAndEnd)]
    .map((_, idx) => addDays(startDate, idx).toLocaleDateString())
    .reverse()

  // This function scrolls to the location of the rendered date
  function scrollToTopPositionOfDate(date) {
    const selectedDate = date.toLocaleDateString().toString()
    const indexOfSelectedDate = arrayOfAllDatesToRender.indexOf(selectedDate)

    const divToScrollIntoView = document.getElementById(indexOfSelectedDate)

    if (divToScrollIntoView) {
      divToScrollIntoView.scrollIntoView({ behavior: 'auto' })
    }
  }

  useEffect(() => {
    // sets max date as today's date... you don't know your weight tomorrow
    const datePickerId = document.getElementById('datePickerId')
    datePickerId.max = new Date().toISOString().split('T')[0]

    if (startOfDay(new Date()).getTime() < weekNextStartDate.getTime()) {
      setNoMoreNext(true)
    }
  }, [startDate, weekNextStartDate])

  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-white">
        <Header />
        <div className="flex justify-between px-4 py-2">
          <input
            type="date"
            id="datePickerId"
            className="bg-transparent"
            value={format(value, 'yyyy-MM-dd')}
            onChange={(e) => {
              const date = e.target.valueAsDate
              if (date.getTime() <= startDate.getTime()) {
                setNumberOfDaysBack(
                  Math.ceil(
                    (startOfDay(new Date().getTime()) - date.getTime()) /
                      (1000 * 3600 * 24)
                  ) + 90
                )
              }
              if (date.getTime() > startDate.getTime()) {
                scrollToTopPositionOfDate(date)
              }

              setValue(date)
            }}
          />
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center justify-center px-2 py-1"
              onClick={() => {
                setNoMoreNext(false)
                scrollToTopPositionOfDate(weekBeforeStartDate)
              }}
            >
              <ChevronLeftIcon className="h-4" />
            </button>
            <button onClick={() => scrollToTopPositionOfDate(endDate)}>
              Today
            </button>
            <button
              className={`flex items-center justify-center px-2 py-1`}
              onClick={() => {
                if (new Date().getTime() >= weekNextStartDate.getTime()) {
                  setNoMoreNext(false)
                  scrollToTopPositionOfDate(weekNextStartDate)
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
        <div className="flex w-full items-center justify-between bg-slate-100 px-4 py-1 text-center backdrop-blur-lg">
          <h2 className="w-2/7">Date</h2>
          <h2 className="w-2/7">Weight</h2>
          <h2 className="w-2/7 mr-12">Avg.</h2>
          <div className="w-1/7"> </div>
        </div>
      </div>
    </>
  )
}

export default Calendar
