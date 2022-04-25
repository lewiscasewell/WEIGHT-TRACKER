import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import AuthProvider from '../context/auth'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <AuthProvider>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </AuthProvider>
  )
}
