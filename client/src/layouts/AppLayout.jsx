import React, { Component } from 'react'
import Header from './Header'
import Footer from './Footer'
import Homepage from './Homepage'
import Notification from '../components/message/notification'
import { Loader, Dimmer } from 'semantic-ui-react'
import { connect } from 'react-redux'


class AppLayout extends Component {
  render() {
    return (
      <div className="wrap">
        <Header {...this.props} />
        <main>
          {this.props.children || <Homepage {...this.props} />}
        </main>
        <Notification />
        <Footer {...this.props} />
      </div>
    )
  }
}

export default connect(
  ({loader}) => ({
    loader
  }),
  {}
)(AppLayout)
