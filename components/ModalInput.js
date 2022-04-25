import Input from './Input'
import React from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'

const ModalInput = () => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  return (
    modalOpen && (
      <React.Fragment>
        <div
          onClick={() => setModalOpen(false)}
          className="fixed z-50 flex min-h-screen min-w-full bg-white/30 backdrop-blur-sm"
        ></div>

        <div
          onClick={() => {}}
          className="absolute z-50 flex w-full items-center justify-center bg-white sm:fixed sm:left-[50%] sm:top-[5%] sm:mt-[25vh] sm:w-fit sm:translate-y-[-50%] sm:translate-x-[-50%] sm:bg-transparent"
        >
          <Input />
        </div>
      </React.Fragment>
    )
  )
}

export default ModalInput
