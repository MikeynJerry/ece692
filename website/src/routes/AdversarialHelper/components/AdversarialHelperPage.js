import React, { useState } from 'react'
import { Form, TextArea, Button, Container } from 'semantic-ui-react'
import AdversarialTextBox from 'components/AdversarialTextBox'

function AdversarialHelperPage() {
  return (
    <Container
      style={{
        background: '#fff',
        boxShadow: '0 1px 2px #ccc',
        width: '80%',
        margin: 'auto',
        height: 'calc(100vh - 90px - 0.875rem - 20px)'
      }}
    >
      <AdversarialHelper />
    </Container>
  )
}

function AdversarialHelper() {
  const [adversarialText, setAdversarialText] = useState(null)
  const [words, setWords] = useState(null)

  const handleChange = () => setAdversarialText(words)

  return (
    <>
      <Form
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <TextArea
          placeholder='Enter adversarial text to display'
          style={{
            minHeight: 100,
            maxHeight: 100,
            marginTop: 20,
            marginLeft: 20,
            marginBottom: 20
          }}
          onChange={(e, { value }) => setWords(value)}
        />

        <Button
          style={{
            maxHeight: 40,
            marginLeft: 20,
            marginRight: 20
          }}
          color='green'
          onClick={handleChange}
        >
          Display
        </Button>
      </Form>
      <AdversarialTextBox text={adversarialText} />
    </>
  )
}

export default AdversarialHelperPage
