const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
  env: {
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
    REACT_APP_AUTH_DOMAIN: process.env.REACT_APP_AUTH_DOMAIN,
    REACT_APP_DATABASE_URL: process.env.REACT_APP_DATABASE_URL,
    REACT_APP_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
    REACT_APP_STORAGE_BUCKET: process.env.REACT_APP_STORAGE_BUCKET,
    REACT_APP_MESSAGING_SENDER_ID: process.env.REACT_APP_MESSAGING_SENDER_ID,
    REACT_APP_APP_ID: process.env.REACT_APP_APP_ID,
  },
})
