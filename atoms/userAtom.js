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
  default: null,
})

export const genderState = atom({
  key: 'gender',
  default: '-',
})

export const unitState = atom({
  key: 'unit',
  default: 'kg',
})

export const heightState = atom({
  key: 'height',
  default: '-',
})

export const activityState = atom({
  key: 'activity',
  default: '-',
})

export const targetWeightState = atom({
  key: 'targetWeight',
  default: '-',
})

export const goalState = atom({
  key: 'goal',
  default: 0,
})

export const birthDateState = atom({
  key: 'birthDate',
  default: null,
})
