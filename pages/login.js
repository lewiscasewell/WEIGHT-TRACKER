import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'next/router'
import { LoginIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import Button from '../components/ui/Button'

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false,
  })

  const router = useRouter()

  const { email, password, error, loading } = data

  useEffect(() => {
    router.prefetch('/')
  })

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setData({ ...data, error: null, loading: true })
    if (!email || !password) {
      setData({ ...data, error: 'All data fields are required!' })
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)

      setData({
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
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto w-80 overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="rounded-bl-4xl relative h-48 bg-red-400">
          <svg
            className="absolute bottom-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          
        </div>
        <div className="rounded-tr-4xl bg-white px-10 pt-4 pb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back! To Tracker
          </h1>
          <div className="mt-12">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-red-400 focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Email address
              </label>
            </div>
            <div className="relative mt-10">
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-red-400 focus:outline-none"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
              >
                Password
              </label>
            </div>
          </div>

          {error ? <p className="m-4">{error}</p> : null}

          <div className="mt-10 flex justify-center">
            <Button
              iconRight={<LoginIcon className="ml-2 h-5" />}
              onClick={() => handleSubmit()}
            >
              {loading ? 'Loading...' : 'Login'}{' '}
            </Button>
          </div>

          <Link href="/register">
            <a className="mt-4 block text-center text-sm font-medium text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300">
              {' '}
              Don't have an account?{' '}
            </a>
          </Link>
          <Link href="/password-reset">
            <a className="mt-4 block text-center text-sm font-medium text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-300">
              {' '}
              Forgot your password?{' '}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
