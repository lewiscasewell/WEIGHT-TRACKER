import React from 'react'
import WeightInputModal from './ui/WeightInputModal'
import NavBar from './ui/NavBar'

export default function Layout({ children }) {
  return (
    <main className="mx-auto flex max-w-7xl">
      <WeightInputModal />
      <NavBar />
      <div className="flex h-[calc(100vh-90px)] w-full flex-col overflow-visible bg-white sm:ml-[68px] sm:h-[100vh] sm:border-r-2 lg:ml-[240px]">
        {children}
      </div>
    </main>
  )
}
