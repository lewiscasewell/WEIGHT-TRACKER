import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { FirebaseAdapter } from '@next-auth/firebase-adapter'
import { db } from '../../../firebase'
import * as firestoreFunctions from 'firebase/firestore'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ...add more providers here
  ],
  //   callbacks: {
  //     async session({ session, token }) {
  //       session.user.tag = session.user.name.split(' ').join('').toLowerCase()

  //       session.user.uid = token.sub
  //       return session
  //     },
  //   },
  adapter: FirebaseAdapter({ ...firestoreFunctions, db }),
})
