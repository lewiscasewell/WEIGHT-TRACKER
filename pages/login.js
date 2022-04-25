import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'next/router'
import { LoginIcon } from '@heroicons/react/outline'

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false,
  })

  const router = useRouter()

  const { email, password, error, loading } = data

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="mb-10">
        <h2 className="">Weight Tracker</h2>
      </div>

      <div className="w-[300px] rounded-md bg-slate-50 p-4 shadow-lg backdrop-blur-lg">
        <div>
          <h2>Login to an account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
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
            <button className="flex w-fit items-center rounded-md border-2 border-red-400 py-1 px-2 text-red-400 transition-colors ease-in hover:bg-red-400 hover:text-white">
              {loading ? 'Loading...' : 'Login'}{' '}
              <LoginIcon className="ml-2 h-5" />
            </button>
          </div>
        </form>
        <div className="mt-3 flex flex-col">
          <text>Don't have an account?</text>
          <button onClick={() => router.push('/register')} className="">
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
