import { atom } from 'recoil'

export const navWeightsState = atom({
  key: 'navWeight',
  default: true,
})

export const navAnalyticsState = atom({
  key: 'navAnalytics',
  default: false,
})

export const navProfileState = atom({
  key: 'navProfile',
  default: false,
})
