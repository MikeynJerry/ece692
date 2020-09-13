import React from 'react'
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire'
import { BrowserRouter as Router } from 'react-router-dom'
import NotificationsProvider from 'modules/notification/NotificationsProvider'
import ThemeProvider from 'modules/theme/ThemeProvider'
import createRoutes from './routes'
import Particles from 'react-particles-js'
import particleConfig from './particles.json'
import 'semantic-ui-css/semantic.min.css'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_authDomain,
  databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
  projectId: process.env.REACT_APP_FIREBASE_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
  appId: process.env.REACT_APP_FIREBASE_appId
}

// Enable Real Time Database emulator if environment variable is set
if (process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST) {
  firebaseConfig.databaseURL = `http://${process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST}?ns=${firebaseConfig.projectId}`
  console.debug(`RTDB emulator enabled: ${firebaseConfig.databaseURL}`) // eslint-disable-line no-console
}

function App() {
  const routes = createRoutes()
  return (
    <>
      <Particles params={particleConfig} />
      <ThemeProvider>
        <FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
          <NotificationsProvider>
            <Router>{routes}</Router>
          </NotificationsProvider>
        </FirebaseAppProvider>
      </ThemeProvider>
    </>
  )
}

export default App
