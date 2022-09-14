import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { auth, db } from '../firebase'

export default function useWeights(weightCountLimit = 90) {
  const [loadingWeights, setLoadingWeights] = useState(true)
  const [weights, setWeights] = useState([
    { weight: '70', date: Timestamp.fromDate(new Date()), id: '' },
  ])
  const [lastWeight, setLastWeight] = useState(70)
  const router = useRouter()

  useEffect(async () => {
    setLoadingWeights(true)

    if (!auth.currentUser) {
      return router.push('/login')
    }

    const weightsRef = collection(db, 'Weights', auth.currentUser.uid, 'Weight')
    const q = query(
      weightsRef,
      orderBy('date', 'desc'),
      limit(weightCountLimit)
    )

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

  return { loadingWeights, weights, lastWeight }
}
