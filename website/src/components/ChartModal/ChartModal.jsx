import React from 'react'
import { books } from './data'
import { List, Modal, Checkbox, Button, Card, Grid } from 'semantic-ui-react'

const Filter = props => {
  const { isSelected, label, onFilterClicked } = props

  return (
    <List.Item key={label}>
      <Checkbox
        label={label}
        value={label}
        onClick={(e, { checked }) => onFilterClicked(label, checked)}
        checked={isSelected}
      />
    </List.Item>
  )
}

const FilterList = props => {
  const { empty, title, filters, onFilterClicked } = props
  return (
    <Card>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
      </Card.Content>
      <Card.Content>
        <List>
          {filters.length ? (
            filters.map((filter, i) => (
              <Filter
                key={i}
                label={filter}
                onFilterClicked={onFilterClicked}
              />
            ))
          ) : (
            <List.Description>
              Select {empty} to see available {title.toLowerCase()}
            </List.Description>
          )}
        </List>
      </Card.Content>
    </Card>
  )
}

const removeDuplicates = arr => Array.from(new Set(arr))
const bookAuthors = removeDuplicates(books.map(book => book.author))
function ChartModal({ createChart }) {
  const defaultFilters = {
    author: [],
    question: [],
    title: []
  }
  const [open, setOpen] = React.useState(false)
  const [filters, setFilters] = React.useState(defaultFilters)

  const setFilter = filter => (label, checked) => {
    let newFilters = Object.assign({}, filters)

    if (checked) newFilters[filter].push(label)

    if (!checked)
      newFilters[filter] = newFilters[filter].filter(f => f !== label)

    setFilters(newFilters)
  }

  const bookQuestions = removeDuplicates(
    books
      .filter(book => filters.author.includes(book.author))
      .map(book => book.question)
  )
  const bookTitles = removeDuplicates(
    books
      .filter(book => filters.question.includes(book.question))
      .map(book => book.title)
  )

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true)
        setFilters(defaultFilters)
      }}
      open={open}
      trigger={<Button>Add Chart</Button>}
    >
      <Modal.Header>Create a Chart</Modal.Header>
      <Modal.Content>
        <Grid columns={3}>
          <Grid.Column>
            <FilterList
              filters={bookAuthors}
              title='Authors'
              onFilterClicked={setFilter('author')}
              empty='nothing'
            />
          </Grid.Column>
          <Grid.Column>
            <FilterList
              filters={bookQuestions}
              title='Questions'
              onFilterClicked={setFilter('question')}
              empty='authors'
            />
          </Grid.Column>
          <Grid.Column>
            <FilterList
              filters={bookTitles}
              title='Books'
              onFilterClicked={setFilter('title')}
              empty='questions'
            />
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='Create Chart'
          labelPosition='right'
          icon='checkmark'
          onClick={() => {
            setOpen(false)
            createChart(filters)
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ChartModal
