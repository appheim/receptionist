import React, { Component } from 'react'
import { connect } from 'react-redux'

class Homepage extends Component {
  constructor() {
    super()
  }


  render() {
    return <div>Homepage</div>
  }
}

export default connect(
  ({session}) => ({
    session,
  }),
  {})(Homepage)