import { LogoutIcon } from '@heroicons/react/outline'
import { startOfDay } from 'date-fns'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Moment from 'react-moment'
import { useRecoilState } from 'recoil'
import { dateState } from '../atoms/dateAtom'
import { userState } from '../atoms/userAtom'
import MainContent from '../components/MainContent'
import { auth, db } from '../firebase'

export default function Profile() {
  const [user, setUser] = useRecoilState(userState)
  const [value, setValue] = useRecoilState(dateState)
  const router = useRouter()

  useEffect(() => {
    if (!auth.currentUser) {
      return router.push('/login')
    }
    getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data())
      }
    })
    setValue(startOfDay(new Date()))
  }, [])

  const handleSignout = async () => {
    signOut(auth)
    router.push('/login')
  }

  return (
    <div>
      <Head>
        <title>WEIGHT-TRACKER / profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContent>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl">Hi, {user?.name}</h2>
              <text className="text-xs">
                Joined{' '}
                <Moment format="MMM DD yyyy">{user?.createdAt.toDate()}</Moment>
              </text>
            </div>
            <button
              className=" flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
              onClick={handleSignout}
            >
              Sign Out
              <LogoutIcon className="ml-2 h-5" />
            </button>
          </div>

          <div>
            <h2>
              You have logged 83 weights with this app! 🙌 Current streak is 8
              🔥
            </h2>
          </div>

          <div className="mt-5 rounded-md bg-slate-100 p-2">
            <h2>Unit:</h2>
            <h2>Target weight</h2>
            <h2>Goal</h2>
          </div>
          <div className="mt-5 flex w-full items-center justify-center"></div>
        </div>
      </MainContent>
    </div>
  )
}

// export async function getServerSideProps(context) {
//   const providers = await getProviders()
//   const session = await getSession(context)

//   return {
//     props: {
//       providers,
//       session,
//     },
//   }
// }
