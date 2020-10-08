import React, { useEffect, useRef, useState } from 'react'
import { Dropdown, Icon, Input } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEquals } from '@fortawesome/free-solid-svg-icons'
import * as d3 from 'd3'

const InputWrapper = ({ empty, errors, position, onChange, query }) => (
  <Input
    onChange={onChange(position)}
    placeholder='Select Word'
    icon={empty[position] ? 'search' : errors[position] ? 'x' : 'checkmark'}
    error={errors[position]}
    value={query[position]}
  />
)

const iconStyle = {
  margin: '0 .5rem'
}

const presetOptions = [
  {
    key: 'Athens -> Berlin',
    text: 'Athens -> Berlin',
    value: ['Athens', 'Greece', 'Germany', 'Berlin']
  },
  {
    key: 'Berlin -> Athens',
    text: 'Berlin -> Athens',
    value: ['Berlin', 'Germany', 'Greece', 'Athens']
  },
  {
    key: 'Memphis -> Seattle',
    text: 'Memphis -> Seattle',
    value: ['Memphis', 'Tennessee', 'Washington', 'Seattle']
  },
  {
    key: 'Seattle -> Memphis',
    text: 'Seattle -> Memphis',
    value: ['Seattle', 'Washington', 'Tennessee', 'Washington']
  },
  {
    key: 'King -> Queen',
    text: 'King -> Queen',
    value: ['King', 'man', 'woman', 'Queen']
  },
  {
    key: 'Queen -> King',
    text: 'Queen -> King',
    value: ['Queen', 'woman', 'man', 'King']
  },
  {
    key: 'Amazing -> Calm',
    text: 'Amazing -> Calm',
    value: ['Amazing', 'Amazingly', 'Calmly', 'Calm']
  },
  {
    key: 'Calm -> Amazing',
    text: 'Calm -> Amazing',
    value: ['Calm', 'Calmly', 'Amazingly', 'Amazing']
  },
  {
    key: 'Aware -> Certain',
    text: 'Aware -> Certain',
    value: ['Aware', 'Unaware', 'Uncertain', 'Certain']
  },
  {
    key: 'Certain -> Aware',
    text: 'Certain -> Aware',
    value: ['Certain', 'Uncertain', 'Unaware', 'Aware']
  },
  {
    key: 'Big -> Cool',
    text: 'Big -> Cool',
    value: ['Big', 'Bigger', 'Cooler', 'Cool']
  },
  {
    key: 'Cool -> Big',
    text: 'Cool -> Big',
    value: ['Cool', 'Cooler', 'Bigger', 'Big']
  },
  {
    key: 'Young -> Old',
    text: 'Young -> Old',
    value: ['Young', 'Youngest', 'Oldest', 'Old']
  },
  {
    key: 'Old -> Young',
    text: 'Old -> Young',
    value: ['Old', 'Oldest', 'Youngest', 'Young']
  },
  {
    key: 'Swimming -> Dancing',
    text: 'Swimming -> Dancing',
    value: ['Swimming', 'Swam', 'Danced', 'Dancing']
  },
  {
    key: 'Dancing -> Swimming',
    text: 'Dancing -> Swimming',
    value: ['Dancing', 'Danced', 'Swam', 'Swimming']
  },
  {
    key: 'Eat -> Play',
    text: 'Eat -> Play',
    value: ['Eat', 'Eats', 'Plays', 'Play']
  },
  {
    key: 'Play -> Eat',
    text: 'Play -> Eat',
    value: ['Play', 'Plays', 'Eats', 'Eat']
  }
]

const margin = { top: 50, right: 150, bottom: 50, left: 150 }
const width = 0.5 * window.innerWidth
const height = 0.7 * window.innerHeight

function WordAnalogies({ wordVectors }) {
  const visualizationRef = useRef(null)
  const [query, setQuery] = useState(['', '', '', ''])
  const [empty, setEmpty] = useState([true, true, true, true])
  const [errors, setErrors] = useState([false, false, false, false])

  useEffect(() => {
    if (empty.some(val => val) || errors.some(val => val)) return

    d3.select(visualizationRef.current).selectAll('*').remove()
    const svg = d3
      .select(visualizationRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // Labels of row and columns
    const xLabels = [...Array(50).keys()]
    const yLabels = query.slice().reverse()

    yLabels.splice(1, 0, `${query[0]} - ${query[1]} + ${query[2]}`)

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, width]).domain(xLabels).padding(0.01)
    svg
      .append('g')
      .attr('id', 'xAxis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick').remove())
      .selectAll('text')
      .remove()

    // Build Y scales and axis:
    const y = d3.scaleBand().range([height, 0]).domain(yLabels).padding(0.01)
    svg
      .append('g')
      .attr('id', 'yAxis')
      .attr('class', 'y axis')
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').remove())

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
        .html(d.value.toFixed(3))
        .style('left', d3.pointer(event)[0] + 100 + 'px')
        .style('top', d3.pointer(event)[1] + 125 + 'px')
    }
    const mouseleave = function (event, d) {
      tooltip.style('opacity', 0)
      d3.select(this).style('stroke', 'none')
    }

    const data = [...Array(5).keys()]
      .map((key, i) => {
        const label = yLabels[i].toLowerCase()
        const rv =
          i === 1
            ? wordVectors[yLabels[4].toLowerCase()]
                .map(
                  (val, ind) => val - wordVectors[yLabels[3].toLowerCase()][ind]
                )
                .map(
                  (val, ind) => val + wordVectors[yLabels[2].toLowerCase()][ind]
                )
            : wordVectors[label]

        return rv.map((value, index) => ({
          group: index,
          variable: yLabels[i],
          value
        }))
      })
      .flat()

    svg
      .selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return x(d.group)
      })
      .attr('y', function (d) {
        return y(d.variable)
      })
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', function (d) {
        return d3.interpolateRdBu((Math.tanh(-d.value) + 1) / 2)
      })
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
  }, [wordVectors, query, empty, errors])

  const handleWordChange = position => (e, { value }) => {
    const newQuery = [...query]
    newQuery[position] = value
    setQuery(newQuery)

    value = value?.toLowerCase()

    const newEmpty = [...empty]
    newEmpty[position] = value === ''
    setEmpty(newEmpty)

    if (value === '') return

    const newErrors = [...errors]
    newErrors[position] = !(value in wordVectors)
    setErrors(newErrors)
  }

  const handlePresetChange = query => {
    setQuery(query)
    setEmpty([false, false, false, false])
    setErrors([false, false, false, false])
  }

  return (
    <>
      <div style={{ marginTop: 10, marginLeft: 10 }}>
        <InputWrapper
          position={0}
          onChange={handleWordChange}
          empty={empty}
          errors={errors}
          query={query}
        />
        <Icon name='minus' style={iconStyle} />
        <InputWrapper
          position={1}
          onChange={handleWordChange}
          empty={empty}
          errors={errors}
          query={query}
        />
        <Icon name='add' style={iconStyle} />
        <InputWrapper
          position={2}
          onChange={handleWordChange}
          empty={empty}
          errors={errors}
          query={query}
        />
        <FontAwesomeIcon icon={faEquals} style={iconStyle} />
        <InputWrapper
          position={3}
          onChange={handleWordChange}
          empty={empty}
          errors={errors}
          query={query}
        />
        <Dropdown
          style={{ marginLeft: 10 }}
          placeholder='Choose a Preset'
          selection
          options={presetOptions}
          onChange={(e, { value }) => handlePresetChange(value)}
        />
      </div>
      <div ref={visualizationRef} />
    </>
  )
}

export default WordAnalogies
