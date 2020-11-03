import React, { useEffect, useState, useRef } from 'react'
import { Form, TextArea, Button } from 'semantic-ui-react'
import { url } from 'constants/url'
import * as d3 from 'd3'
import './ModelPredictions.css'

const width = 1200
const height = 1000
const nodePaddingSize = 4
const nodesPerSubLayer = 25

const vectorWidths = [50, 300]
const docSplits = [350, 1400, 3500]

function ModelPredictions({ weights, layout }) {
  const visualizationRef = useRef(null)
  const tempNNRef = useRef(null)
  const [waitingOnPrediction, setWaitingOnPrediction] = useState(false)
  const [prediction, setPrediction] = useState({})
  const [words, setWords] = useState('')

  useEffect(() => {
    if (!layout || !weights) return

    const nodeSize = width / nodesPerSubLayer - nodePaddingSize

    const nodes = layout
      .map((numNodes, layer) => Array(numNodes).fill({ layer }))
      .flat()
      .map((node, i) => ({ ...node, id: i, index: i }))

    const numNodes = [0, ...d3.cumsum(layout)]
    const links = weights
      .map((layerWeights, layer) =>
        layerWeights.map((nodeWeights, source) =>
          nodeWeights.map((weight, target) => ({
            source: source + numNodes[layer],
            target: target + numNodes[layer + 1],
            weight
          }))
        )
      )
      .flat(Infinity)

    const weightColor = d3
      .scaleDiverging(t => d3.interpolateRdBu(1 - t))
      .domain([-0.5, 0, 0.5])

    const svg = d3
      .select(tempNNRef.current)
      .append('svg')
      .attr('width', width + 40)
      .attr('height', height)

    const xDist = width / nodesPerSubLayer - nodePaddingSize / 2
    const subLayerCounts = layout.map(numNodes =>
      Math.ceil(numNodes / nodesPerSubLayer)
    )
    const subLayerSums = [0, ...d3.cumsum(subLayerCounts)]
    const spacing = 2
    const numSubLayers = subLayerCounts.reduce(
      (sum, val) => sum + val + spacing
    )
    const yDistances = subLayerSums.map(
      (subLayerCount, i) =>
        ((subLayerCount + i * spacing) * height * 0.6) / (numSubLayers + 1)
    )

    const paddedNodeSize = nodeSize + nodePaddingSize

    nodes.forEach(function (d, i) {
      const adjustedId = (d.id - numNodes[d.layer]) % nodesPerSubLayer
      const adjustedSubLayer = Math.floor(
        (d.id - numNodes[d.layer]) / nodesPerSubLayer
      )
      if (d.layer !== 2) {
        d.x = adjustedId * xDist + paddedNodeSize
      }
      if (d.layer === 2) {
        d.x = ((adjustedId + 1) * width) / 2
      }
      if (adjustedSubLayer % 2 === 1) d.x = d.x + paddedNodeSize / 2
      d.y =
        yDistances[d.layer] +
        adjustedSubLayer * nodeSize +
        5 +
        paddedNodeSize / 2
    })

    // draw links
    const link = svg
      .append('g')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('id', function (d) {
        return `${d.source}-${d.target}`
      })
      .attr('class', 'link inactive')
      .attr('x1', function (d) {
        return nodes[d.source].x
      })
      .attr('y1', function (d) {
        return nodes[d.source].y
      })
      .attr('x2', function (d) {
        return nodes[d.target].x
      })
      .attr('y2', function (d) {
        return nodes[d.target].y
      })
      .style('stroke-width', function (d) {
        return Math.abs(d.weight) * 5
      })
      .style('stroke', function (d) {
        return weightColor(d.weight)
      })

    // draw nodes
    const node = svg
      .append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
      .on('mouseover', function (event, d) {
        const before = d.layer > 0 ? d3.selectAll(`*[id$='-${d.id}']`) : null
        const after = d.layer < 2 ? d3.selectAll(`*[id^='${d.id}-']`) : null
        if (before) before.classed('inactive', false)
        if (after) after.classed('inactive', false)
      })
      .on('mouseout', function (event, d) {
        const before = d.layer > 0 ? d3.selectAll(`*[id$='-${d.id}']`) : null
        const after = d.layer < 2 ? d3.selectAll(`*[id^='${d.id}-']`) : null
        if (before) before.classed('inactive', true)
        if (after) after.classed('inactive', true)
      })
      .attr('class', 'node')
      .attr('r', nodeSize / 2)
      .style('fill', function (d) {
        return '#666'
      })
      .style('opacity', function (d) {
        return 0.6
      })

    const groups = vectorWidths
      .map(width =>
        docSplits.map(split => `vec width: ${width} - split: ${split}`)
      )
      .flat()

    const barX = d3.scaleBand().domain(groups).range([0, width])

    svg
      .append('g')
      .attr('transform', 'translate(40, ' + (height - 50) + ')')
      .attr('class', 'axis')
      .call(d3.axisBottom(barX).tickSize(0))

    const barY = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height * 0.3, 0])

    svg
      .append('g')
      .attr('transform', 'translate(40,' + (height * 0.7 - 50) + ')')
      .attr('class', 'axis')
      .call(d3.axisLeft(barY))

    svg
      .append('circle')
      .attr('cx', 0.5 * width - 50)
      .attr('cy', height - 20)
      .attr('r', 6)
      .style('fill', 'rgb(5, 48, 97)')
    svg
      .append('circle')
      .attr('cx', 0.5 * width + 50)
      .attr('cy', height - 20)
      .attr('r', 6)
      .style('fill', 'rgb(103, 0, 31)')
    svg
      .append('text')
      .attr('x', 0.5 * width - 50 + 10)
      .attr('y', height - 20)
      .text('Not Doyle')
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle')
    svg
      .append('text')
      .attr('x', 0.5 * width + 50 + 10)
      .attr('y', height - 20)
      .text('Doyle')
      .style('font-size', '15px')
      .attr('alignment-baseline', 'middle')
  }, [layout, weights])

  useEffect(() => {
    if (
      !Object.prototype.hasOwnProperty.call(prediction, 50) ||
      !Object.prototype.hasOwnProperty.call(prediction, 300)
    )
      return

    const svg = d3.select(tempNNRef.current).select('svg')

    const groups = vectorWidths
      .map(width =>
        docSplits.map(split => `vec width: ${width} - split: ${split}`)
      )
      .flat()

    const bars = vectorWidths
      .map(width =>
        docSplits.map(split =>
          prediction[width][split].probabilities.map((probability, i) => ({
            group: `vec width: ${width} - split: ${split}`,
            subgroup: i,
            prediction: prediction[width][split].prediction[0],
            probability
          }))
        )
      )
      .flat(Infinity)

    const barX = d3.scaleBand().domain(groups).range([0, width])

    const xSubgroup = d3
      .scaleBand()
      .domain([0, 1])
      .range([0, barX.bandwidth()])
      .padding([0.05])

    const colors = d3
      .scaleDiverging(t => d3.interpolateRdBu(1 - t))
      .domain([0, 0.5, 1])

    const barY = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height * 0.3, 0])

    svg.select('#bars').remove()

    svg
      .append('g')
      .attr('id', 'bars')
      .selectAll('g')
      .data(bars)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        return 'translate(' + (40 + barX(d.group)) + ',' + (height - 50) + ')'
      })
      .append('rect')
      .attr('x', function (d) {
        return xSubgroup(d.subgroup)
      })
      .attr('y', function (d) {
        return -(height * 0.3 - barY(d.probability * 100))
      })
      .attr('width', xSubgroup.bandwidth())
      .attr('height', function (d) {
        return height * 0.3 * d.probability
      })
      .attr('fill', function (d) {
        return colors(d.subgroup)
      })

    const weightColor = d3
      .scaleDiverging(t => d3.interpolateRdBu(1 - t))
      .domain([-0.5, 0, 0.5])

    const layerToActivation = {
      0: 'input',
      1: 'hidden',
      2: 'output'
    }

    const sums = [0, ...d3.cumsum(layout)]
    svg.selectAll('.node').style('fill', function (d) {
      return weightColor(
        prediction.activations[layerToActivation[d.layer]][d.id - sums[d.layer]]
      )
    })
  }, [prediction])

  const handlePredict = () => {
    if (!words) return
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
    <>
      <Form
        style={{
          width: '90%',
          display: 'inline-block',
          marginRight: '10px',
          marginBottom: '20px'
        }}
      >
        <TextArea
          placeholder='Enter text to predict'
          style={{
            minHeight: 100,
            maxHeight: 100,
            marginTop: 25,
            marginLeft: 25,
            width: '80%',
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
      <div ref={visualizationRef} />
      <div ref={tempNNRef} />
    </>
  )
}

export default ModelPredictions
