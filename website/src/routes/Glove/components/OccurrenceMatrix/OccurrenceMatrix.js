import React, { useRef, useEffect, useState } from 'react'
import { Button, Dropdown, Form, Input, TextArea } from 'semantic-ui-react'
import * as d3 from 'd3'
import './OccurrenceMatrix.css'

const orderOptions = [
  { key: 'default', value: 'default', text: 'Input Order' },
  { key: 'name', value: 'name', text: 'Alphabetical' },
  { key: 'descending', value: 'descending', text: 'Lowest First' },
  { key: 'ascending', value: 'ascending', text: 'Highest First' }
]

const margin = { top: 100, right: 50, bottom: 50, left: 100 }
const width = 500
const height = 500

function OccurrenceMatrix() {
  const occurrenceMatrixRef = useRef(null)

  const [windowSize, setWindowSize] = useState(2)
  const [matrix, setMatrix] = useState([])
  const [orderBy, setOrderBy] = useState('default')
  const [words, setWords] = useState('')

  const handleWindowSize = (e, { value }) => setWindowSize(parseInt(value))

  const handleReset = () =>
    d3.select(occurrenceMatrixRef.current).selectAll('*').remove()

  const handleGenerate = () => {
    if (words === '') return
    const splitWords = words.split(' ')
    const wordSet = Array.from(
      new Set(splitWords.map(word => word.toLowerCase()))
    )
    const wordMap = Object.fromEntries(wordSet.map((word, i) => [word, i]))
    const matrix = new Array(wordSet.length)
      .fill(0)
      .map(_ => new Array(wordSet.length).fill(0))
    for (let i = 0; i < splitWords.length; i++) {
      const focusWord = splitWords[i].toLowerCase()
      for (let j = i - windowSize; j <= i + windowSize; j++) {
        if (j < 0 || j >= splitWords.length) continue
        const contextWord = splitWords[j].toLowerCase()
        matrix[wordMap[focusWord]][wordMap[contextWord]] += 1
      }
    }
    setMatrix(matrix)
  }

  useEffect(() => {
    if (matrix.flat().length === 0) return
    if (isNaN(windowSize)) return

    const splitWords = words.split(' ')
    const wordSet = Array.from(
      new Set(splitWords.map(word => word.toLowerCase()))
    )

    const nodes = matrix.map((row, i) =>
      row.map((val, j) => ({ x: i, y: j, z: val }))
    )
    // matrix works, not to convert to d3 format

    const n = wordSet.length

    const x = d3.scaleBand().range([0, width])
    const c = d3
      .scaleSequential()
      .domain([0, 5])
      .clamp(true)
      .interpolator(d3.interpolatePuRd)

    handleReset()
    const svg = d3
      .select(occurrenceMatrixRef.current)
      .append('svg')
      .attr('class', 'occurrences')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('margin', 'auto')
      .style('display', 'block')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const matrixSums = matrix.map(val =>
      val.reduce((total, num) => total + num)
    )
    const orders = {
      name: d3.range(n).sort(function (a, b) {
        return d3.ascending(wordSet[a], wordSet[b])
      }),
      default: d3.range(n),
      ascending: d3.range(n).sort(function (a, b) {
        return d3.descending(matrixSums[a], matrixSums[b])
      }),
      descending: d3.range(n).sort(function (a, b) {
        return d3.ascending(matrixSums[a], matrixSums[b])
      })
    }

    // The default sort order.
    x.domain(orders[orderBy].map(val => wordSet[val]))

    svg
      .append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height)

    const tooltip = d3
      .select(occurrenceMatrixRef.current)
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
      d3.selectAll('.column text').attr('class', function (t, i) {
        return d.y === t[i].y ? 'active' : ''
      })
      d3.selectAll('.row text').attr('class', function (t, i) {
        return d.x === t[i].x ? 'active' : ''
      })
    }
    const mousemove = function (event, d) {
      tooltip
        .html(d.z)
        .style('left', event.offsetX + 500 + 'px')
        .style('top', event.offsetY + 140 + 'px')
    }
    const mouseleave = function (event, d) {
      tooltip.style('opacity', 0)
      d3.select(this).style('stroke', 'none')
      d3.selectAll('.column text').attr('class', '')
      d3.selectAll('.row text').attr('class', '')
    }

    const row = svg
      .selectAll('.row')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', function (d, i) {
        return 'translate(0,' + x(wordSet[i]) + ')'
      })
      .each(rowFn)

    row.append('line').attr('x2', width)

    row
      .append('text')
      .attr('x', -6)
      .attr('y', x.bandwidth() / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text(function (d, i) {
        return wordSet[i]
      })

    const column = svg
      .selectAll('.column')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'column')
      .attr('transform', function (d, i) {
        return 'translate(' + x(wordSet[i]) + ')rotate(-90)'
      })

    column.append('line').attr('x1', -width)

    column
      .append('text')
      .attr('x', 6)
      .attr('y', x.bandwidth() / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'start')
      .text(function (d, i) {
        return wordSet[i]
      })

    function rowFn(row) {
      d3.select(this)
        .selectAll('.cell')
        .data(row)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', function (d, i) {
          return x(wordSet[d.y])
        })
        .attr('width', x.bandwidth())
        .attr('height', x.bandwidth())
        .style('fill', function (d) {
          return c(d.z)
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
    }
  }, [matrix, orderBy])

  return (
    <>
      <Form
        style={{ width: '90%', display: 'inline-block', marginRight: '10px' }}
      >
        <TextArea
          placeholder='Enter text for co-occurrence matrix'
          style={{
            minHeight: 100,
            maxHeight: 100,
            marginTop: 25,
            marginLeft: 25,
            width: 0.8 * window.innerWidth > 600 ? '60%' : '50%'
          }}
          onChange={(e, { value }) => setWords(value)}
        />
        <Button.Group vertical style={{ marginTop: 40, marginLeft: 20 }}>
          <Button color='green' onClick={handleGenerate}>
            Generate
          </Button>
          <Button color='red' onClick={handleReset}>
            Reset
          </Button>
        </Button.Group>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            marginLeft: 20
          }}
        >
          <Dropdown
            compact
            selection
            defaultValue='default'
            options={orderOptions}
            onChange={(e, { value }) => setOrderBy(value)}
          />
          <Input
            placeholder='Window Size (default: 2)'
            onChange={handleWindowSize}
            error={isNaN(windowSize)}
          />
        </div>
      </Form>

      <div ref={occurrenceMatrixRef} />
    </>
  )
}

export default OccurrenceMatrix
