import React, { useEffect, useState, useRef } from 'react'
import {
  Container,
  Dimmer,
  Dropdown,
  Loader,
  Form,
  TextArea,
  Button,
  Input
} from 'semantic-ui-react'
import Scrollbar from 'react-scrollbars-custom'
import * as d3 from 'd3'

function Loading() {
  return (
    <Dimmer active>
      <Loader indeterminate>Waiting on the model server to start up</Loader>
    </Dimmer>
  )
}

const margin = { top: 100, right: 50, bottom: 50, left: 100 }
const width = 500
const height = 500
const authors = ['Fletcher', 'Rinehart', 'Doyle', 'Christie', 'King']

const url = 'http://127.0.0.1:5000'
function CrimeRecognitionPage() {
  const visualizationRef = useRef(null)
  const [serverWaking, setServerWaking] = useState(true)
  const [waitingOnPrediction, setWaitingOnPrediction] = useState(false)
  const [prediction, setPrediction] = useState({
    prediction: 4,
    probabilities: [0.1, 0.2, 0.3, 0.15, 0.25]
  })
  const [words, setWords] = useState('lawjdh awldhawdl aw; dhawdh ')

  useEffect(() => {
    const data = {
      prediction: 4,
      probabilities: [0.1, 0.2, 0.3, 0.15, 0.25]
    }
    console.log('this is running')
    if (
      !prediction.hasOwnProperty('prediction') ||
      !prediction.hasOwnProperty('probabilities')
    )
      console.log('prediction malformed')

    const x = d3
      .scaleBand()
      .domain(authors)
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.probabilities)])
      .nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = g =>
      g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .call(g =>
          g
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text(data.y)
        )

    const svg = d3
      .select(visualizationRef.current)
      .append('svg')
      .attr('class', 'predictions')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('margin', 'auto')
      .style('display', 'block')

    const tooltip = d3
      .select(visualizationRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px')

    const mouseover = function (event, d) {
      tooltip.style('opacity', 1)
      d3.select(this).style('stroke', 'black')
    }
    const mousemove = function (event, d) {
      tooltip
        .html(`${(d * 100).toFixed(2)}%`)
        .style('left', d3.pointer(event)[0] + 100 + 'px')
        .style('top', d3.pointer(event)[1] + 125 + 'px')
    }
    const mouseleave = function (event, d) {
      tooltip.style('opacity', 0)
      d3.select(this).style('stroke', 'none')
    }

    svg
      .append('g')
      .attr('fill', 'blue')
      .selectAll('rect')
      .data(data.probabilities)
      .join('rect')
      .attr('x', (d, i) => x(authors[i]))
      .attr('y', d => y(d))
      .attr('height', d => y(0) - y(d))
      .attr('width', x.bandwidth())
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)

    svg.append('g').call(xAxis)

    svg.append('g').call(yAxis)
  }, [])

  useEffect(() => {
    let elapsed = false
    let loaded = false

    setTimeout(() => {
      elapsed = true
      if (loaded) setServerWaking(false)
    }, 2000)

    async function wakeUpModel() {
      await fetch(`${url}/wakeup`)
        .then(r => {
          loaded = true
          if (elapsed) setServerWaking(false)
        })
        .catch(err => console.log('error', err))
    }
    wakeUpModel()
  }, [])

  const handlePredict = () => {
    setWaitingOnPrediction(true)
    let elapsed = false
    let loaded = false
    let receivedData = {}

    setTimeout(() => {
      elapsed = true
      if (loaded) {
        setWaitingOnPrediction(false)
        setPrediction(receivedData)
      }
    }, 2000)
    async function requestPrediction(data) {
      await fetch(`${url}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(r => {
          console.log(r)
          receivedData = r
          loaded = true
          if (elapsed) {
            setWaitingOnPrediction(false)
            setPrediction(receivedData)
          }
        })
    }
    requestPrediction(words)
  }

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
        {!serverWaking && (
          <>
            <Form
              style={{
                width: '90%',
                display: 'inline-block',
                marginRight: '10px'
              }}
            >
              <TextArea
                placeholder='Enter text to predict'
                style={{
                  minHeight: 100,
                  maxHeight: 100,
                  marginTop: 25,
                  marginLeft: 25,
                  width: 0.8 * window.innerWidth > 600 ? '60%' : '50%',
                  pointerEvents: waitingOnPrediction ? 'none' : 'inherit'
                }}
                onChange={(e, { value }) => setWords(value)}
              />
              <Button
                style={{ marginTop: 55, marginLeft: 20 }}
                color='green'
                onClick={handlePredict}
                loading={waitingOnPrediction}
                disabled={waitingOnPrediction}
              >
                Predict
              </Button>
            </Form>
          </>
        )}
        {serverWaking && <Loading />}
        <div ref={visualizationRef} />
      </Scrollbar>
    </Dimmer.Dimmable>
  )
}

export default CrimeRecognitionPage
