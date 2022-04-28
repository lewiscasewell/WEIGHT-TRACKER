import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import AllWeights from '../components/AllWeights'
import Calendar from '../components/Calendar'
import MainContent from '../components/MainContent'
import ModalInput from '../components/ModalInput'
import { useRecoilState } from 'recoil'
import { auth, db } from '../firebase'
import { userState, lastWeightState, weightsState } from '../atoms/userAtom'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function Home() {
  const myRef = React.createRef()
  const [scrollTop, setScrollTop] = useState(0)

  const [user, setUser] = useRecoilState(userState)
  const [weights, setWeights] = useRecoilState(weightsState)
  const [lastWeight, setLastWeight] = useRecoilState(lastWeightState)
  const [loadingWeights, setLoadingWeights] = useState(false)
  const router = useRouter()

  const onScroll = () => {
    const scrollTop = myRef.current.scrollTop
    setScrollTop(scrollTop)
  }
  console.log(loadingWeights)
  useEffect(async () => {
    setLoadingWeights(true)
    if (!auth.currentUser) {
      return router.push('/login')
    }
    await getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
      }
    })

    const weightsRef = collection(db, 'Weights', auth.currentUser.uid, 'Weight')
    const q = query(weightsRef, orderBy('date', 'desc'))

    const unsub = onSnapshot(q, (querySnapshot) => {
      let weights = []
      querySnapshot.forEach((doc) => {
        weights.push(Object.assign(doc.data(), { id: doc.id }))
      })
      setWeights(weights)
      setLastWeight(weights[0])
      setLoadingWeights(false)
    })
    return () => unsub()
  }, [])

  return (
    <div>
      {/* <Head>
        <title>WEIGHT-TRACKER</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <MainContent>
        <Calendar />
        <AllWeights
          scrollTop={scrollTop}
          myRef={myRef}
          onScroll={onScroll}
          weights={weights}
          loadingWeights={loadingWeights}
        />
      </MainContent>
    </div>
  )
}
