import { atom } from 'recoil'

export const userState = atom({
  key: 'user',
  default: null,
})

export const weightsState = atom({
  key: 'weights',
  default: [],
})

export const lastWeightState = atom({
  key: 'lastWeight',
  default: 70,
})
