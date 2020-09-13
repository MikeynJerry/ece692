import React, { useState } from 'react'
import { Container, Modal, Button, Dropdown } from 'semantic-ui-react'
import Scrollbar from 'react-scrollbars-custom'
import fletcherData from '../../../../static/fletcher.json'
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

function sortData(data) {
  const sortBy = 'title'
  console.log(data)
  const sortedData = data.sort((a, b) =>
    a[sortBy].toUpperCase() > b[sortBy].toUpperCase() ? 1 : -1
  )
  return processData(sortedData)
}

function parseMatch(chapter, sentence, chapterLengths) {
  const chapterLength = chapterLengths[chapter - 1]
  console.log([
    chapter + sentence / chapterLength,
    chapter + (sentence + 1) / chapterLength
  ])
  return [
    chapter + sentence / chapterLength,
    chapter + (sentence + 1) / chapterLength
  ]
}

function filterData(data, filters) {
  return data.filter(book =>
    Object.keys(filters).every(key => {
      console.log(
        book,
        key,
        !!!filters[key].length,
        filters[key].includes(book[key]),
        !!!filters[key].length || filters[key].includes(book[key])
      )
      return !!!filters[key].length || filters[key].includes(book[key])
    })
  )
}

function processData(data, filters) {
  const normalize = false

  data = filterData(data, {
    author: [],
    title: [],
    queryType: [],
    question: [],
    ...filters
  })

  const bookTitles = Array.from(new Set(data.map(book => book.title)))
  const bookQuestions = Array.from(new Set(data.map(book => book.question)))
  const bookLengths = data.map(book => book.numChapters)
  const maxBookLength = Math.max(...bookLengths)

  const counts = Object.fromEntries(
    new Array(maxBookLength)
      .fill()
      .map((_, chapter) => {
        const rv = {}
        for (const book of data) {
          if (chapter < book.numChapters)
            rv[`${book.title} - ${book.question}`] = book.results[chapter + 1]
        }
        return rv
      })
      .map((val, key) => [key + 1, val])
  )

  return {
    counts: Object.keys(counts).map(key => {
      counts[key].x = parseInt(key)
      return counts[key]
    }),
    titles: bookTitles,
    questions: bookQuestions
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

function Chart({ data: { counts, titles, questions } }) {
  const lines = titles
    .map(title => questions.map(question => `${title} - ${question}`))
    .flat()
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
            position: 'insideBottomLeft',
            offset: 20,
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

const createDropdown = key =>
  Array.from(new Set(fletcherData.map(book => book[key]))).map(key => ({
    key,
    text: key,
    value: key
  }))

const authorOptions = createDropdown('author')
const questionOptions = createDropdown('question')
const bookOptions = createDropdown('title')

function AddChart({ createChart }) {
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState({})

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Add Chart</Button>}
    >
      <Modal.Header>Create a Chart</Modal.Header>
      <Modal.Content>
        <Dropdown
          multiple
          search
          selection
          placeholder='Authors'
          options={authorOptions}
        />
        <Dropdown
          multiple
          search
          selection
          placeholder='Questions'
          options={questionOptions}
        />
        <Dropdown
          multiple
          search
          selection
          placeholder='Books'
          options={bookOptions}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Create Chart'
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            setOpen(false)
            createChart({ author: ['J.S. Fletcher'] })
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

function HomePage() {
  const [chartData, addChartData] = useState([])

  const addChart = filters => addChartData(chartData.concat([filters]))

  return (
    <Container
      style={{
        background: '#fff',
        boxShadow: '0 1px 2px #ccc',
        width: '80%',
        margin: 'auto'
      }}
    >
      <Scrollbar style={{ height: 'calc(100vh - 90px)' }}>
        <Container>
          {chartData.map((filters, i) => (
            <Chart key={i} data={processData(fletcherData, filters)} />
          ))}
          <AddChart createChart={addChart} />
        </Container>
      </Scrollbar>
    </Container>
  )
}

export default HomePage
