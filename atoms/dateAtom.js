import { startOfDay } from 'date-fns'
import { atom } from 'recoil'

export const dateState = atom({
  key: 'date',
  default: new Date(),
})

export const numberOfDaysBackState = atom({
  key: 'numberOfDaysBack',
  default: 90,
})

export const priorDateState = atom({
  key: 'priorDate',
  default: startOfDay(
    new Date(new Date().setDate(startOfDay(new Date()).getDate() - 90))
  ),
})
