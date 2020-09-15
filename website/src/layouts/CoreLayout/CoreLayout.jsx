import React, { Component } from 'react'
import {
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import './CoreLayout.css'

const getWidth = () => {
  const isSSR = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class DesktopContainer extends Component {
  state = {}

  handleBottomPassedReverse = () => this.setState({ fixed: false })
  handleBottomPassed = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Responsive
        getWidth={getWidth}
        minWidth={Responsive.onlyTablet.minWidth}
        className='desktop-responsive-layout'
      >
        <Visibility
          once={false}
          onBottomPassed={this.handleBottomPassed}
          onBottomPassedReverse={this.handleBottomPassedReverse}
        >
          <Segment inverted textAlign='center' vertical style={{ padding: 0 }}>
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
              className='header__menu'
            >
              <Container>
                <Menu.Item
                  as={Link}
                  to='/'
                  active
                  className='header__menu__item'
                  style={{ borderColor: 'transparent' }}
                >
                  Natural Language Processing
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </Visibility>

        {children}
        <Footer />
      </Responsive>
    )
  }
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
          width='thin'
        >
          <Menu.Item as={Link} to='/' onClick={this.handleSidebarHide}>
            NLP
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment inverted textAlign='center' vertical>
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
              </Menu>
            </Container>
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

const CoreLayout = ({ children, ...props }) => (
  <div style={{ height: '100%' }}>
    <DesktopContainer {...props}>{children}</DesktopContainer>
    <MobileContainer {...props}>{children}</MobileContainer>
  </div>
)

export default CoreLayout
