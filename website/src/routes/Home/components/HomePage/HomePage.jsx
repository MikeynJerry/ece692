import React, { useState, Fragment } from 'react'
import { Container, Modal, Button, Dropdown, Divider } from 'semantic-ui-react'
import Scrollbar from 'react-scrollbars-custom'
import fletcherData from 'static/fletcher.json'
import {
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Brush
} from 'recharts'
import ChartModal from 'components/ChartModal'

function sortData(data) {
  const sortBy = 'title'
  const sortedData = data.sort((a, b) =>
    a[sortBy].toUpperCase() > b[sortBy].toUpperCase() ? 1 : -1
  )
  return processData(sortedData)
}

function filterData(data, filters) {
  return data.filter(book =>
    Object.keys(filters).every(key => {
      return !!!filters[key].length || filters[key].includes(book[key])
    })
  )
}

function processData(data, filters) {
  const normalize = false

  data = filterData(data, {
    author: [],
    title: [],
    question: [],
    ...filters
  })

  const bookLengths = data.map(book => book.numChapters)
  const maxBookLength = Math.max(...bookLengths)

  const counts = Object.fromEntries(
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

  return {
    books: data,
    counts: Object.keys(counts).map(key => {
      counts[key].x = parseInt(key)
      return counts[key]
    })
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

function Chart({ data: { books, counts } }) {
  const lines = books.map(
    book => `${book.title} - ${book.question} - "${book.query}"`
  )
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        width={730}
        height={250}
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
        <Tooltip />
        <Legend />
        {lines.map((title, i) => (
          <Line
            type='monotone'
            dataKey={title}
            stroke={colors[i]}
            key={`${title}-${i}`}
          />
        ))}
        <Brush dataKey='x' height={20} />
      </LineChart>
    </ResponsiveContainer>
  )
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
        <Container>
          {chartData.map((filters, i) => (
            <Fragment key={`fragment-${i}`}>
              <Chart
                key={`chart-${i}`}
                data={processData(fletcherData, filters)}
              />
              <Divider key={`divider-${i}`} />
            </Fragment>
          ))}
          <ChartModal createChart={createChart} />
        </Container>
      </Scrollbar>
    </Container>
  )
}

export default HomePage
