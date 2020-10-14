import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { SuspenseWithPerf } from 'reactfire'
import LoadingSpinner from '../components/LoadingSpinner'
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import CrimeAnalysisRoute from './CrimeAnalysis'
import CrimeRecognitionRoute from './CrimeRecognition'
import GloveRoute from './Glove'
import NotFoundRoute from './NotFound'

export default function createRoutes() {
  return (
    <CoreLayout>
      <SuspenseWithPerf fallback={<LoadingSpinner />} traceId='router-wait'>
        <Switch>
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Route exact path={Home.path} component={() => <Home.component />} />
          {[CrimeAnalysisRoute, CrimeRecognitionRoute, GloveRoute].map(
            settings => (
              <Route key={`Route-${settings.path}`} {...settings} />
            )
          )}
          <Route component={NotFoundRoute.component} />
        </Switch>
      </SuspenseWithPerf>
    </CoreLayout>
  )
}
