import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { setDoc, doc, Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
      <div>
        <h2>Create an account</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
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

        <div>
          <button>{loading ? 'loading...' : 'Register'}</button>
        </div>
      </form>
      <div>
        <text>Already have an account?</text>
        <button onClick={() => router.push('/login')}>Login here</button>
      </div>
    </div>
  )
}

export default Register
