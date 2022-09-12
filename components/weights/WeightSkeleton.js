import React from 'react'

const WeightSkeleton = () => {
  return (
    <div className="flex h-[62px] w-full animate-pulse items-center justify-between px-4 py-1">
      {[...Array(4)].map((i, idx) => (
        <div key={idx} className="h-5 w-14 rounded-full bg-slate-200"></div>
      ))}
    </div>
  )
}

export default WeightSkeleton
