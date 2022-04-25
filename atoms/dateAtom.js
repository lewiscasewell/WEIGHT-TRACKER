import { atom } from 'recoil'

export const dateState = atom({
  key: 'date',
  default: new Date(),
})

export const numberOfDaysBackState = atom({
  key: 'numberOfDaysBack',
  default: 90,
})
