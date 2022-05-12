import { atom } from 'recoil'

export const modalState = atom({
  key: 'modal',
  default: false,
})

export const editProfileModalState = atom({
  key: 'editProfileModal',
  default: false,
})
