import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import AuthProvider from '../context/auth'
import Head from 'next/head'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <AuthProvider>
      <RecoilRoot>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link href="/icons/32.png" rel="icon" type="image/png" />
          <link rel="apple-touch-icon" href="/icons/192.png" />
          <meta name="theme-color" content="#fff" />
          <meta name="apple-mobile-web-app-status-bar-style" content="white" />
          <title>WEIGHT-TRACKER</title>
          <meta
            name="description"
            content="A PWA to log and track weights and see analytics for the number of calories you should consume in order to reach your weight goals"
          />
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <meta name="theme-color" />
        </Head>
        <Component {...pageProps} />
      </RecoilRoot>
    </AuthProvider>
  )
}
