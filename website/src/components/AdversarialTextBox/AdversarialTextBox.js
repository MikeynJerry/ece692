import React, { useEffect, useState, useRef } from 'react'
import Scrollbar from 'react-scrollbars-custom'
import { Button, Container } from 'semantic-ui-react'
import './AdversarialTextBox.css'

const CLEAN_INDEX = 0
const ADVERSARIAL_INDEX = 1

function Split({
  data,
  adversarialCount,
  setAdversarialCount,
  totalTokens,
  setTotalTokens
}) {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const numAdversarial = data[ADVERSARIAL_INDEX].split(' ').length
  const numClean = data[CLEAN_INDEX].split(' ').length

  const handleChange = () => {
    const nextIndex = (selectedIndex + 1) % 2
    const isAdversarial = nextIndex ? numAdversarial : -numAdversarial
    setSelectedIndex(nextIndex)
    setAdversarialCount(adversarialCount + isAdversarial)
    const difference = numClean - numAdversarial
    const tokenChange = nextIndex ? -difference : difference
    setTotalTokens(totalTokens + tokenChange)
  }

  return (
    <span
      style={{ color: selectedIndex ? 'green' : 'red' }}
      onClick={handleChange}
    >
      {data[selectedIndex]}
    </span>
  )
}

function AdversarialTextBox({
  text,
  height = 'calc(100vh - 90px - 0.875rem - 20px - 160px)'
}) {
  const adversarialTextRef = useRef(null)
  const [adversarialCount, setAdversarialCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [showCounts, setShowCounts] = useState(false)
  const [totalTokens, setTotalTokens] = useState(1)

  useEffect(() => {
    if (!text) return
    const numAdversarial = (text.match(/<([^<]+\|[^>]+)>/g) || [])
      .map(match =>
        match.replace(/<|>/g, '').split('|')[ADVERSARIAL_INDEX].split(' ')
      )
      .flat().length
    setAdversarialCount(numAdversarial)
    const numClean = text.replace(/\s<([^<]+\|[^>]+)>\s/g, ' ').split(' ')
      .length
    setTotalTokens(numClean + numAdversarial)
  }, [text])

  if (!text) return null

  const splits = text.split(/<([^<]+\|[^>]+)>/)
  const components = splits.map((fragment, i) => {
    if (!fragment.includes('|')) return fragment
    return (
      <Split
        key={`${text.length}-${i}`}
        data={fragment.split('|')}
        adversarialCount={adversarialCount}
        setAdversarialCount={setAdversarialCount}
        totalTokens={totalTokens}
        setTotalTokens={setTotalTokens}
      />
    )
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(adversarialTextRef.current.textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Container
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className='adversarial-container'
      style={{ position: 'relative ' }}
    >
      <Scrollbar
        style={{
          height
        }}
        contentProps={{ style: { paddingRight: 3 } }}
      >
        <div ref={adversarialTextRef}>{components}</div>
      </Scrollbar>
      {hovering && (
        <Button
          onMouseEnter={() => setShowCounts(true)}
          onMouseLeave={() => setShowCounts(false)}
          style={{ position: 'absolute', top: 15, right: 71, opacity: 0.85 }}
        >
          {showCounts
            ? `${adversarialCount} / ${totalTokens}`
            : `${((adversarialCount / totalTokens) * 100).toFixed(2)}%`}
        </Button>
      )}
      {hovering && (
        <Button
          color={copied ? 'green' : null}
          icon={copied ? 'checkmark' : 'clipboard'}
          style={{ position: 'absolute', top: 15, right: 31, opacity: 0.85 }}
          onClick={handleCopy}
        />
      )}
    </Container>
  )
}

export default AdversarialTextBox
