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

export const genderState = atom({
  key: 'gender',
  default: 'Gender',
})

export const unitState = atom({
  key: 'unit',
  default: 'kg',
})

export const heightState = atom({
  key: 'height',
  default: 180,
})

export const activityState = atom({
  key: 'activity',
  default: 'Activity',
})

export const targetWeightState = atom({
  key: 'targetWeight',
  default: 70,
})

export const goalState = atom({
  key: 'goal',
  default: 'Goal',
})
