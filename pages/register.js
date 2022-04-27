import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc, Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { LoginIcon } from '@heroicons/react/outline'

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  })

  const router = useRouter()

  const { name, email, password, error, loading } = data

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setData({ ...data, error: null, loading: true })
    if (!name || !email || !password) {
      setData({ ...data, error: 'All data fields are required!' })
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, 'Users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        unit: 'kg',
        targetWeight: 70,
      })

      setData({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
      })

      router.replace('/')
    } catch (err) {
      setData({ ...data, error: err.message, loading: false })
    }
  }

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="mb-10">
          <h2 className="">Weight Tracker</h2>
        </div>

        <div className="w-[300px] rounded-md bg-slate-50 p-4 shadow-lg backdrop-blur-lg">
          <div>
            <h2>Create an account</h2>
          </div>
          <div>
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
              />
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </div>

            {error ? (
              <text m={4} color="red">
                {error}
              </text>
            ) : null}
            <div className="mt-3 flex w-full items-center justify-center">
              <button
                onClick={() => handleSubmit()}
                className="flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
              >
                {loading ? 'Loading...' : 'Register'}{' '}
                <LoginIcon className="ml-2 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <text>Already have an account?</text>
            <button onClick={() => router.push('/login')} className="">
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
