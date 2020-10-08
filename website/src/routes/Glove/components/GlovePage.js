import React, { useEffect, useState } from 'react'
import { Container, Dimmer, Dropdown, Loader } from 'semantic-ui-react'
import OccurrenceMatrix from './OccurrenceMatrix'
import WordAnalogies from './WordAnalogies'
import WordProjections from './WordProjections'
import Scrollbar from 'react-scrollbars-custom'
import * as d3 from 'd3'
import csvFile from './minimal.50d.3f.csv'

function Loading() {
  return (
    <Dimmer active>
      <Loader indeterminate>
        Downloading and Preparing Word Vectors <br /> (This may take a moment)
      </Loader>
    </Dimmer>
  )
}

const visualizationOptions = [
  {
    key: 'Co-occurrence Matrix',
    text: 'Co-occurrence Matrix',
    value: 'Co-occurrence Matrix'
  },
  {
    key: 'Word Analogies',
    text: 'Word Analogies',
    value: 'Word Analogies'
  },
  {
    key: 'Word Projections',
    text: 'Word Projections',
    value: 'Word Projections'
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

function GlovePage() {
  const [loading, setLoading] = useState(true)
  const [wordVectors, setWordVectors] = useState({})
  const [visualization, setVisualization] = useState('')

  useEffect(() => {
    d3.csv(csvFile).then(data => {
      const newWordVectors = {}
      for (let i = 0; i < data.length; i++) {
        const wordData = data[i]

        const wordVector = []
        for (const dimension in wordData)
          if (dimension !== '0') wordVector.push(+wordData[dimension])
        newWordVectors[wordData[0]] = wordVector
      }
      setWordVectors(newWordVectors)
      setLoading(false)
    })
  }, [])

  return (
    <Dimmer.Dimmable
      as={Container}
      dimmed={loading}
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
        {loading && <Loading />}
        {visualization === 'Word Analogies' && (
          <WordAnalogies wordVectors={wordVectors} />
        )}
        {visualization === 'Co-occurrence Matrix' && <OccurrenceMatrix />}
        {visualization === 'Word Projections' && (
          <WordProjections wordVectors={wordVectors} />
        )}
      </Scrollbar>
    </Dimmer.Dimmable>
  )
}

export default GlovePage
