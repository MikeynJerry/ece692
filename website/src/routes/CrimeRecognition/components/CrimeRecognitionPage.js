import React, { useEffect, useState } from 'react'
import { Container, Dimmer, Dropdown, Loader } from 'semantic-ui-react'
import AdversarialDialect from './AdversarialDialect'
import ModelPredictions from './ModelPredictions'
import Scrollbar from 'react-scrollbars-custom'
import { url } from 'constants/url'

function Loading({ error }) {
  const message = error
    ? 'Something went wrong. Try reloading the page.'
    : 'Waiting on the model server to start up'
  return (
    <Dimmer active>
      <Loader indeterminate={error}>{message}</Loader>
    </Dimmer>
  )
}

const visualizationOptions = [
  {
    key: 'Dialect Translation',
    text: 'Dialect Translation',
    value: 'Dialect Translation'
  },
  {
    key: 'Model Predictions',
    text: 'Model Predictions',
    value: 'Model Predictions'
  }
]

const centeredStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 'calc(100vh - 90px - 0.875rem - 20px)'
}

const topRightStyle = {
  float: 'right',
  marginTop: 10,
  marginRight: 10
}

function CrimeRecognitionPage() {
  const [serverWaking, setServerWaking] = useState(true)
  const [visualization, setVisualization] = useState('')
  const [networkWeights, setNetworkWeights] = useState(null)
  const [networkLayout, setNetworkLayout] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let elapsed = false
    let loaded = false

    setTimeout(() => {
      elapsed = true
      if (loaded) setServerWaking(false)
    }, 2000)

    async function wakeUpModel() {
      await fetch(`${url}/wakeup`)
        .then(r => r.json())
        .then(r => {
          loaded = true
          if (elapsed) setServerWaking(false)
          setNetworkWeights(r.weights)
          setNetworkLayout(r.layout)
        })
        .catch(err => setError(true))
    }
    wakeUpModel()
  }, [])

  return (
    <Dimmer.Dimmable
      as={Container}
      dimmed={serverWaking}
      style={{
        background: '#fff',
        boxShadow: '0 1px 2px #ccc',
        width: '80%',
        margin: 'auto'
      }}
    >
      <Scrollbar style={{ height: 'calc(100vh - 90px - 0.875rem - 20px)' }}>
        <div style={visualization === '' ? centeredStyle : topRightStyle}>
          <Dropdown
            placeholder='Visualization Type'
            selection
            options={visualizationOptions}
            onChange={(e, { value }) => setVisualization(value)}
          />
        </div>
        {serverWaking && <Loading error={error} />}
        {visualization === 'Dialect Translation' && <AdversarialDialect />}
        {visualization === 'Model Predictions' && (
          <ModelPredictions weights={networkWeights} layout={networkLayout} />
        )}
      </Scrollbar>
    </Dimmer.Dimmable>
  )
}

export default CrimeRecognitionPage
