import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { SuspenseWithPerf } from 'reactfire'
import LoadingSpinner from '../components/LoadingSpinner'
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import NotFoundRoute from './NotFound'

export default function createRoutes() {
  return (
    <CoreLayout>
      <SuspenseWithPerf fallback={<LoadingSpinner />} traceId='router-wait'>
        <Switch>
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Route exact path={Home.path} component={() => <Home.component />} />
          {/* Build Route components from routeSettings
            [
              AccountRoute,
              ProjectsRoute,
              SignupRoute,
              LoginRoute
            ].map((settings) =>
              settings.authRequired ? (
                <PrivateRoute key={`Route-${settings.path}`} {...settings} />
              ) : (
                <Route key={`Route-${settings.path}`} {...settings} />
              )
            )
              */}
          <Route component={NotFoundRoute.component} />
        </Switch>
      </SuspenseWithPerf>
    </CoreLayout>
  )
}
