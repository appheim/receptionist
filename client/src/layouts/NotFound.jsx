import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export class NotFound extends Component {
  render() {
    return (
      <div className="wrap">
        <Header {...this.props} />
        <main style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20em', }}>.404</div>
          <div>The page you are trying to reach does not exist, or has been moved.<Link className="link" to="/">Go to homepage</Link></div>
        </main>
        <Footer {...this.props} />
      </div>
    )
  }
}