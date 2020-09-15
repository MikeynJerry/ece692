import React from 'react'
import Typography from '@material-ui/core/Typography'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <div className='parent'>
      <div className='x'>
        <div className='y' style={{ color: 'white' }}>
          <Typography variant='h2'>Whoops! 404!</Typography>
          <Typography variant='h4'>This page was not found.</Typography>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
