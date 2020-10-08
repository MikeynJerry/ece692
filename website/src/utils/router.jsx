import React, { Suspense } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

/**
 * Render children based on route config objects
 * @param {Array} routes - Routes settings array
 * @param {Object} match - Routes settings array
 * @param {Object} parentProps - Props to pass to children from parent
 * @returns {Array} List of routes
 */
export function renderChildren(routes, parentProps) {
  return routes.map(route => {
    const match = useRouteMatch()
    return (
      <Route
        key={`${match.url}-${route.path}`}
        path={`${match.url}/${route.path}`}
        render={props => <route.component {...parentProps} {...props} />}
      />
    )
  })
}

/**
 * Create component which is loaded async, showing a loading spinner
 * in the meantime.
 * @param {Function} loadFunc - Loading options
 * @returns {React.Component}
 */
export function loadable(loadFunc) {
  const OtherComponent = React.lazy(loadFunc)
  return function LoadableWrapper(loadableProps) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OtherComponent {...loadableProps} />
      </Suspense>
    )
  }
}
