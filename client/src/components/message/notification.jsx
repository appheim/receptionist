import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hideNotification } from './reducers'

class Notification extends Component {
  componentDidUpdate() {
    if (this.props.notification.isActive) {
      setTimeout(() => {
        this.props.hideNotification();
      }, this.props.notification.duration);
    }
  }
  render() {
    return (
      <div className={`notification ${this.props.notification.error ? 'error' : ''} ${this.props.notification.isActive ? 'open' : ''}`}>
        <div className="btn-close" onClick={this.props.hideNotification}></div>
        <h4 className="title">{this.props.notification.title}</h4>
        <p className="text">{this.props.notification.text}</p>
      </div>
    )
  }
}

export default connect(
  ({notification}) => ({
    notification,
  }),
  { hideNotification, }
)(Notification)