import React, { useState } from 'react'
import { Form, TextArea, Button, Dropdown } from 'semantic-ui-react'
import AdversarialTextBox from 'components/AdversarialTextBox'
import translations from './translations.json'

const changeDialect = (text, country) => {
  for (const [key, value] of Object.entries(translations[country])) {
    text = text.replace(new RegExp(`\\b${key}\\b`, 'gi'), `<${key}|${value}>`)
  }
  return text
}

const countryOptions = [
  {
    key: 'uk_to_us',
    value: 'uk_to_us',
    text: 'British -> American'
  },
  {
    key: 'us_to_uk',
    value: 'us_to_uk',
    text: 'American -> British'
  }
]
function AdversarialDialect() {
  const [adversarialText, setAdversarialText] = useState('')
  const [waitingOnResponse, setWaitingOnResponse] = useState(false)
  const [country, setCountry] = useState('uk_to_us')
  const [words, setWords] = useState('')

  const handlePerturb = () => {
    setWaitingOnResponse(true)
    const perturbedText = changeDialect(words, country)
    setTimeout(() => {
      setWaitingOnResponse(false)
      setAdversarialText(perturbedText)
    }, 2000)
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
            pointerEvents: waitingOnResponse ? 'none' : 'inherit'
          }}
          onChange={(e, { value }) => setWords(value)}
        />
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            marginLeft: 20,
            marginTop: 33
          }}
        >
          <Button
            style={{ margin: 0 }}
            color='green'
            onClick={handlePerturb}
            loading={waitingOnResponse}
            disabled={waitingOnResponse}
          >
            Perturb
          </Button>
          <Dropdown
            style={{ marginTop: 10 }}
            options={countryOptions}
            defaultValue='uk_to_us'
            selection
            onChange={(e, { value }) => setCountry(value)}
          />
        </div>
      </Form>
      <AdversarialTextBox
        text={adversarialText}
        height='calc((((100vh - 90px) - 0.875rem) - 20px) - 210px)'
      />
    </>
  )
}

export default AdversarialDialect
