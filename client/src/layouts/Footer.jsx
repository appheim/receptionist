import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div>© {new Date().getFullYear()} Appheim</div>
        </div>
      </footer>
    )
  }
}

