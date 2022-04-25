// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDRS6VnHamrHXc3Cy9hEEsrZd79SCGVT1w',
  authDomain: 'weight-tracker-6f7e0.firebaseapp.com',
  databaseURL: 'https://weight-tracker-6f7e0-default-rtdb.firebaseio.com',
  projectId: 'weight-tracker-6f7e0',
  storageBucket: 'weight-tracker-6f7e0.appspot.com',
  messagingSenderId: '881073428521',
  appId: '1:881073428521:web:065c0d1fbd4848ff7d2438',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()
const auth = getAuth()

export default app
export { db, storage, auth }
