import React, { useState, Fragment } from 'react'
import { Container, Divider } from 'semantic-ui-react'
import Scrollbar from 'react-scrollbars-custom'
import { books } from 'components/ChartModal/data'
import {
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  BarChart,
  Bar,
  Brush
} from 'recharts'
import ChartModal from 'components/ChartModal'

function filterData(data, filters) {
  return data.filter(book =>
    Object.keys(filters).every(key => {
      return !filters[key].length || filters[key].includes(book[key])
    })
  )
}

const wordNumberLabels = {
  0: '3rd before',
  1: '2nd before',
  2: '1st before',
  3: '1st after',
  4: '2nd after',
  5: '3rd after'
}
function processData(data, filters) {
  data = filterData(data, {
    author: [],
    title: [],
    question: [],
    ...filters
  })

  const bookLengths = data.map(book => book.numChapters)
  const maxBookLength = Math.max(...bookLengths)

  let counts, chartType
  if (filters.question.length === 1 && filters.question[0] === 'Nearby Words') {
    chartType = 'bar'
    counts = new Array(6).fill().map((_, wordNumber) => {
      const rv = { x: wordNumberLabels[wordNumber] }
      for (const book of data) {
        const [word, count] =
          wordNumber < 3 ? book.before[wordNumber] : book.after[wordNumber - 3]
        rv[
          `${book.title} - ${book.question} - "${book.query.replace('.', '')}"`
        ] = {
          word,
          count
        }
      }
      return rv
    })
  } else {
    chartType = 'line'
    counts = Object.fromEntries(
      new Array(maxBookLength)
        .fill()
        .map((_, chapter) => {
          const rv = {}
          for (const book of data) {
            if (chapter < book.numChapters)
              rv[`${book.title} - ${book.question} - "${book.query}"`] =
                book.results[chapter + 1]
          }
          return rv
        })
        .map((val, key) => [key + 1, val])
    )
    counts = Object.keys(counts).map(key => {
      counts[key].x = parseInt(key)
      return counts[key]
    })
  }

  console.log(counts)
  return {
    books: data,
    counts,
    chartType
  }
}

const colors = [
  '#003f5c',
  '#444e86',
  '#955196',
  '#dd5182',
  '#ff6e54',
  '#ffa600'
]

function LChart({ lines, counts, height }) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <LineChart
        data={counts}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='x'
          label={{ value: 'Chapters', position: 'insideBottom', offset: 10 }}
          height={50}
        />
        <YAxis
          label={{
            value: 'Occurrences',
            position: 'insideLeft',
            angle: -90
          }}
        />
        <Tooltip separator=': ' />
        <Legend />
        {lines.map((title, i) => (
          <Line
            type='monotone'
            dataKey={title}
            stroke={colors[i % colors.length]}
            key={`${title}-${i}`}
          />
        ))}
        <Brush dataKey='x' height={20} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function BChart({ lines, counts, height }) {
  const tooltipFormatter = (value, name, props) => {
    const { payload } = props
    const formattedName = `${name.split(' - ')[0]} - ${payload[name].word} `
    return [value, formattedName]
  }
  console.log(lines)
  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart data={counts}>
        <XAxis dataKey='x' />
        <YAxis />
        <Tooltip formatter={tooltipFormatter} separator=': ' />
        <Legend />
        {lines.map((title, i) => (
          <Bar
            dataKey={`${title}.count`}
            name={title}
            key={`${title}-${i}`}
            fill={colors[i % colors.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

function Chart({ data: { books, counts, chartType } }) {
  const lines = books.map(
    book =>
      `${book.title} - ${book.question} - "${book.query.replace('.', '')}"`
  )
  const chartHeight = 300 + 20 * (lines.length - 6)
  if (chartType === 'line')
    return <LChart lines={lines} counts={counts} height={chartHeight} />
  if (chartType === 'bar')
    return <BChart lines={lines} counts={counts} height={chartHeight} />
}

function HomePage() {
  const [chartData, addChartData] = useState([])

  const createChart = filters => addChartData(chartData.concat([filters]))

  return (
    <Container
      style={{
        background: '#fff',
        boxShadow: '0 1px 2px #ccc',
        width: '80%',
        margin: 'auto'
      }}
    >
      <Scrollbar style={{ height: 'calc(100vh - 90px - 0.875rem - 20px)' }}>
        <Container style={{ width: '100%' }}>
          {chartData.map((filters, i) => (
            <Fragment key={`fragment-${i}`}>
              <Chart data={processData(books, filters)} />
              <Divider />
            </Fragment>
          ))}
          <ChartModal createChart={createChart} />
        </Container>
      </Scrollbar>
    </Container>
  )
}

export default HomePage
