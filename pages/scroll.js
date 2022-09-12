import React, { useLayoutEffect, useRef } from 'react'
import Loading from '../components/ui/Loading'
import Weight from '../components/weights/Weight'
import useWeights from '../hooks/useWeights'

export default function Scroll() {
  const { loadingWeights, weights } = useWeights()
  const scrollRef = useRef(null)

  const topPosition = scrollRef?.current?.getBoundingClientRect().top

  const onScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight
    console.log(scrollPosition)
    if (topPosition < scrollPosition) {
      console.log('hi')
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="overflow-y-scroll">
      {loadingWeights && <Loading />}
      {!loadingWeights && (
        <>
          {weights.map((item, index) => (
            <Weight
              key={item.id}
              date={item.date.toDate()}
              id={item.id}
              weight={item.weight}
              weightId={item.id}
            />
          ))}
        </>
      )}
    </div>
  )
}
