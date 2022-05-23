import React from 'react'
import ModalInput from './ModalInput'
import NavBar from './NavBar'

const MainContent = ({ children }) => {
  return (
    <main className="mx-auto flex max-w-7xl overflow-y-hidden">
      <ModalInput />
      <NavBar />
      <div className="flex h-[100vh] w-full flex-col bg-white sm:ml-[68px] sm:border-r-2 lg:ml-[240px]">
        {children}
      </div>
    </main>
  )
}

export default MainContent
