import React from 'react'
import { Container, Card } from 'semantic-ui-react'
import crimeImage from 'static/crime.png'
import gloveAnalogies from 'static/gloveAnalogies.png'
import gloveOccurrences from 'static/gloveOccurrences.png'
import gloveProjections from 'static/gloveProjections.png'
import crimePredictions from 'static/crimePredictions.png'
import adversarialHelper from 'static/adversarialHelper.png'
import Scrollbar from 'react-scrollbars-custom'
import {
  ADVERSARIAL_HELPER_PATH,
  CRIME_ANALYSIS_PATH,
  CRIME_RECOGNITION_PATH,
  GLOVE_PATH
} from 'constants/paths'

function HomePage() {
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
        <Card.Group itemsPerRow={2} style={{ margin: 0 }}>
          <Card
            image={crimeImage}
            header='Crime Novel Plot Analysis'
            href={CRIME_ANALYSIS_PATH}
            raised
          />
          <Card
            image={
              [gloveAnalogies, gloveOccurrences, gloveProjections][
                Math.floor(3 * Math.random())
              ]
            }
            header='GloVe Embedding Demo'
            href={GLOVE_PATH}
            raised
          />
          <Card
            image={crimePredictions}
            header='Crime Novel Author Recognition'
            href={CRIME_RECOGNITION_PATH}
            raised
          />
          <Card
            image={adversarialHelper}
            header='Adversarial Helper'
            href={ADVERSARIAL_HELPER_PATH}
            raised
          />
        </Card.Group>
      </Scrollbar>
    </Container>
  )
}

export default HomePage
