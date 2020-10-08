import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { analogyOptions } from './analogyOptions'
import { Button, Dropdown, Grid, Input } from 'semantic-ui-react'
import './WordProjections.css'

const margin = { top: 50, right: 50, bottom: 50, left: 200 }
const width = 500
const height = 500

const dropdownOptions = analogyOptions.map(option => ({
  key: option.name,
  value: option.name,
  text: option.name
}))

const subtractVectors = (a, b) => a.map((val, ind) => val - b[ind])
const dotProduct = (a, b) => a.reduce((total, val, ind) => total + val * b[ind])
const vectorNorm = a => Math.sqrt(a.reduce((total, val) => total + val ** 2))
const cosineSimilarity = (a, b) =>
  dotProduct(a, b) / (vectorNorm(a) * vectorNorm(b))

function WordProjections({ wordVectors }) {
  const wordRelationshipsRef = useRef(null)

  const [addWords, setAddWords] = useState(['', ''])
  const [words, setWords] = useState([])
  const [tempAxisWords, setTempAxisWords] = useState([
    ['', ''],
    ['', '']
  ])
  const [xAxisWords, setXAxisWords] = useState(['', ''])
  const [yAxisWords, setYAxisWords] = useState(['', ''])

  const handleDropdown = (e, { value }) => {
    const analogy = analogyOptions.filter(
      analogyOption => analogyOption.name === value
    )[0]
    setWords([...analogy.words])
    setXAxisWords([...analogy.xAxis])
    setYAxisWords([...analogy.yAxis])
    setTempAxisWords([[...analogy.xAxis], [...analogy.yAxis]])
  }

  const handleInput = position => (e, { value }) => {
    const newAddWords = [...addWords]
    newAddWords[position] = value
    setAddWords(newAddWords)
  }

  const handleAxisInput = (axis, position) => (e, { value }) => {
    const newTempAxisWords = [...tempAxisWords]
    newTempAxisWords[axis][position] = value
    setTempAxisWords(newTempAxisWords)
  }

  const handleAxesChange = () => {
    const newXAxisWords = []
    for (const word of tempAxisWords[0]) newXAxisWords.push(word)
    setXAxisWords(newXAxisWords)

    const newYAxisWords = []
    for (const word of tempAxisWords[1]) newYAxisWords.push(word)
    setYAxisWords(newYAxisWords)
  }

  const handleAddWords = () => {
    const newWords = [...words]
    const wordPair = []
    for (const word of addWords) if (word !== '') wordPair.push(word)

    newWords.push(wordPair)
    setWords(newWords)
    setAddWords(['', ''])
  }

  useEffect(() => {
    const xAxisVector = subtractVectors(
      wordVectors[xAxisWords[0]],
      wordVectors[xAxisWords[1]]
    )
    const yAxisVector = subtractVectors(
      wordVectors[yAxisWords[0]],
      wordVectors[yAxisWords[1]]
    )

    const data = words.map((arr, i) =>
      arr.map(word => ({
        word,
        x: cosineSimilarity(wordVectors[word], xAxisVector),
        y: cosineSimilarity(wordVectors[word], yAxisVector),
        group: i
      }))
    )

    const flatData = data.flat()
    const flatXData = flatData.map(datum => datum.x)
    const flatYData = flatData.map(datum => datum.y)
    const xMin = Math.min(...flatXData)
    const xMax = Math.max(...flatXData)
    const yMin = Math.min(...flatYData)
    const yMax = Math.max(...flatYData)
    const xMargin = (xMax - xMin) * 0.1
    const yMargin = (yMax - yMin) * 0.1

    d3.select(wordRelationshipsRef.current).selectAll('*').remove()
    const svg = d3
      .select(wordRelationshipsRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const graph = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = d3
      .scaleLinear()
      .domain([xMin - xMargin, xMax + xMargin])
      .range([0, width])

    const xAxis = graph
      .append('g')
      .attr('id', 'xAxis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

    xAxis
      .append('text')
      .attr('dx', (width * 39) / 40)
      .attr('dy', 38)
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(xAxisWords[0])

    xAxis
      .append('text')
      .attr('dx', width / 40)
      .attr('dy', 38)
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(xAxisWords[1])

    const y = d3
      .scaleLinear()
      .domain([yMin - yMargin, yMax + yMargin])
      .range([height, 0])

    const yAxis = graph
      .append('g')
      .attr('id', 'yAxis')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y))

    yAxis
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('dy', -38)
      .attr('dx', 0)
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(yAxisWords[0])

    yAxis
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('dy', -38)
      .attr('dx', -height * 0.92)
      .attr('fill', 'black')
      .attr('font-size', '16px')
      .text(yAxisWords[1])

    const lines = graph.append('g').attr('id', 'lines')

    for (const datum of data)
      for (let i = 0; i < datum.length - 1; i++)
        lines
          .append('line')
          .attr('stroke', 'blue')
          .attr('id', `line-${datum[i].group}`)
          .attr('x1', x(datum[i].x))
          .attr('x2', x(datum[i + 1].x))
          .attr('y1', y(datum[i].y))
          .attr('y2', y(datum[i + 1].y))

    const containers = graph
      .selectAll('dot')
      .data(flatData)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        return 'translate(' + x(d.x) + ',' + y(d.y) + ')'
      })

    containers.append('circle').attr('r', 2)

    containers
      .append('text')
      .attr('cursor', 'pointer')
      .text(d => d.word)
      .attr('dx', 4)
      .on('mouseover', function (event, d) {
        containers.attr('class', function (t, j) {
          return t.group === d.group ? '' : 'unselected'
        })
        lines.selectAll('*').attr('class', 'unselected')
        lines.selectAll(`#line-${d.group}`).attr('class', '')
      })
      .on('mouseout', function (event, d) {
        containers.attr('class', '')
        lines.selectAll('*').attr('class', '')
      })
      .on('dblclick', function (event, d) {
        const newWords = [...words]
        newWords.splice(d.group, 1)
        setWords(newWords)
      })
  }, [words, xAxisWords, yAxisWords, wordVectors])

  return (
    <>
      <div style={{ display: 'inline-block' }} ref={wordRelationshipsRef} />
      <div style={{ float: 'right', width: '31%' }}>
        <Grid columns={3} style={{ marginTop: 0 }}>
          <Grid.Row centered>
            <Dropdown
              placeholder='Choose a preset'
              selection
              options={dropdownOptions}
              onChange={handleDropdown}
            />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleInput(0)}
                error={
                  addWords[0] !== '' &&
                  !(addWords[0].toLowerCase() in wordVectors)
                }
                value={addWords[0]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleInput(1)}
                error={
                  addWords[1] !== '' &&
                  !(addWords[1].toLowerCase() in wordVectors)
                }
                value={addWords[1]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
            <Grid.Column>
              <Button
                disabled={
                  (addWords[0] === '' && addWords[1] === '') ||
                  !(addWords[0].toLowerCase() in wordVectors) ||
                  !(addWords[1].toLowerCase() in wordVectors)
                }
                onClick={handleAddWords}
              >
                Add word
                {addWords[0] === '' || addWords[1] === '' ? '' : 's'}
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Grid.Column>
              <h3>Axes</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleAxisInput(0, 1)}
                error={
                  tempAxisWords[0][1] !== '' &&
                  !(tempAxisWords[0][1].toLowerCase() in wordVectors)
                }
                value={tempAxisWords[0][1]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleAxisInput(0, 0)}
                error={
                  tempAxisWords[0][0] !== '' &&
                  !(tempAxisWords[0][0].toLowerCase() in wordVectors)
                }
                value={tempAxisWords[0][0]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleAxisInput(1, 1)}
                error={
                  tempAxisWords[1][1] !== '' &&
                  !(tempAxisWords[1][1].toLowerCase() in wordVectors)
                }
                value={tempAxisWords[1][1]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                placeholder='Type a word'
                onChange={handleAxisInput(1, 0)}
                error={
                  tempAxisWords[1][0] !== '' &&
                  !(tempAxisWords[1][0].toLowerCase() in wordVectors)
                }
                value={tempAxisWords[1][0]}
                style={{ maxWidth: 120 }}
              />
            </Grid.Column>
            <Grid.Column>
              <Button onClick={handleAxesChange}>Change Axes</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </>
  )
}

export default WordProjections
