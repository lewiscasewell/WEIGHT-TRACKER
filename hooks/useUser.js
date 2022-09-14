import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'

export default function useUser() {
  const [loadingUser, setLoadingUser] = useState(true)
  const [user, setUser] = useState({
    activity: '',
    birthDate: Timestamp.fromDate(new Date()),
    createdAt: '',
    email: '',
    gender: '',
    goal: 0,
    height: '',
    name: '',
    targetWeight: '',
    uid: '',
    unit: '',
  })

  const router = useRouter()

  useEffect(async () => {
    setLoadingUser(true)
    if (!auth.currentUser) {
      return router.push('/login')
    }
    await getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
        setLoadingUser(false)
      }
    })
  }, [])

  return { loadingUser, user }
}
