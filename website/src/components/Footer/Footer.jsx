import React from 'react'
import { Container } from 'semantic-ui-react'
import './Footer.css'

function Footer() {
  return (
    <Container className='footer' fluid>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://github.com/MikeynJerry'
        className='footer__link'
      >
        About Me
      </a>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://github.com/MikeynJerry/ece692'
        className='footer__link'
      >
        Learn More
      </a>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='mailto:jdunca51@vols.utk.edu?subject=Natural Language Processing'
        className='footer__link'
      >
        Email Me
      </a>
    </Container>
  )
}

export default Footer
