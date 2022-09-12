import React, { useState } from 'react'
import AllWeights from '../components/weights/AllWeights'
import Calendar from '../components/weights/Calendar'
import useWeights from '../hooks/useWeights'
import Loading from '../components/ui/Loading'
import { useRecoilValue } from 'recoil'
import { numberOfDaysBackState } from '../atoms/dateAtom'
import Layout from '../components/layout'

export default function Home() {
  const numberOfDaysBack = useRecoilValue(numberOfDaysBackState)
  const myRef = React.createRef()
  const [scrollTop, setScrollTop] = useState(0)
  const { weights, loadingWeights } = useWeights(numberOfDaysBack)

  const onScroll = () => {
    const scrollTop = myRef.current.scrollTop
    setScrollTop(scrollTop)
  }

  return (
    <Layout>
      <Calendar />
      {loadingWeights && <Loading />}
      {!loadingWeights && (
        <AllWeights
          scrollTop={scrollTop}
          myRef={myRef}
          onScroll={onScroll}
          weights={weights}
          loadingWeights={loadingWeights}
        />
      )}
    </Layout>
  )
}
