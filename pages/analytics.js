import { startOfDay } from 'date-fns'
import { da } from 'date-fns/locale'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { lastWeightState, userState, weightsState } from '../atoms/userAtom'
import MainContent from '../components/MainContent'
import WeightOptionsMenu from '../components/WeightOptionsMenu'
import { auth, db } from '../firebase'

export default function Analytics() {
  const [weights, setWeights] = useRecoilState(weightsState)
  const [user, setUser] = useRecoilState(userState)
  const [lastWeight, setLastWeight] = useRecoilState(lastWeightState)
  const [value, setValue] = useRecoilState(dateState)

  useEffect(() => {
    setValue(startOfDay(new Date()))
    const weightsRef = collection(db, 'Weights', auth.currentUser.uid, 'Weight')
    const q = query(weightsRef, orderBy('date', 'desc'))

    const unsub = onSnapshot(q, (querySnapshot) => {
      let weights = []
      querySnapshot.forEach((doc) => {
        weights.push(Object.assign(doc.data(), { id: doc.id }))
      })
      setWeights(weights)
      setLastWeight(weights[0])
    })
    return () => unsub()
  }, [])
  return (
    <div>
      <Head>
        <title>WEIGHT-TRACKER / analytics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContent>
        <div className="p-4">To see weight analytics add some weights...</div>
        <div className="p-4">
          To see calorie analytics finish your profile...
        </div>
      </MainContent>
    </div>
  )
}
