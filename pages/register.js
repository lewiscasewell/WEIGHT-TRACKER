import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc, Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { LoginIcon } from '@heroicons/react/outline'
import Link from 'next/link'

const Register = () => {
  const [data, setData] = useState({
    name: '',
    birthDate: null,
    email: '',
    password: '',
    error: null,
    loading: false,
  })
  // const [birthDate, setBirthDate] = useState()

  const router = useRouter()

  const { name, birthDate, email, password, error, loading } = data

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  // const handleBirthDateChange = (e) => {
  //   setBirthDate(e.target.value)
  // }

  const handleSubmit = async () => {
    setData({ ...data, error: null, loading: true })

    if (!name || !email || !password || !birthDate) {
      setData({ ...data, error: 'All data fields are required!' })
      // setBirthDate(null)
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await setDoc(doc(db, 'Users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        unit: 'kg',
        birthDate: Timestamp.fromDate(new Date(birthDate)),
      })

      setData({
        name: '',
        birthDate: null,
        email: '',
        password: '',
        error: null,
        loading: false,
      })
      // setBirthDate(null)

      router.replace('/')
    } catch (err) {
      setData({ ...data, error: err.message, loading: false })
    }
  }

  const current = new Date().toISOString().split('T')[0]

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto w-80 overflow-hidden rounded-3xl bg-white shadow-xl">
        <div class="rounded-bl-4xl relative h-48 bg-red-400">
          <svg
            class="absolute bottom-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fill-opacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="rounded-tr-4xl bg-white px-10 pt-4 pb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome!</h1>
          <div className="mt-12">
            <div class="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                placeholder="John Doe"
              />
              <label
                for="name"
                className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Name
              </label>
            </div>
            <div class="relative mt-10">
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={birthDate}
                max={current}
                onChange={handleChange}
                class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
              />
              <label
                for="birthDate"
                class="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Birth date
              </label>
            </div>
            <div class="relative mt-10">
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                placeholder="john@doe.com"
              />
              <label
                for="email"
                className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Email address
              </label>
            </div>
            <div class="relative mt-10">
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-rose-600 focus:outline-none"
                placeholder="Password"
              />
              <label
                for="password"
                class="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Password
              </label>
            </div>
          </div>

          {error ? <p className="m-4">{error}</p> : null}

          <button
            onClick={() => handleSubmit()}
            className="mt-10 flex w-full items-center justify-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white"
          >
            {loading ? 'Loading...' : 'Register'}{' '}
            <LoginIcon className="ml-2 h-5" />
          </button>

          <Link href="/login">
            <a className="mt-4 block text-center text-sm font-medium text-rose-600 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-500">
              {' '}
              Already have an account?{' '}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
