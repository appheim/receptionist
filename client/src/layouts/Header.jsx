import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../modules/session'
import { Dropdown } from 'semantic-ui-react'

class Header extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    return () => {
      this.props.logout();
      this.props.router.push('/auth/login/');
    }
  }

  render() {

    const profile = (
      this.props.session.token ?
        (<div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <Dropdown
            icon={null}
            trigger={<span>Username</span>}>
            <Dropdown.Menu>
              <Dropdown.Item text="Logout" onClick={this.logout()} />
            </Dropdown.Menu>
          </Dropdown>
        </div >) :
        (<Link className="ui button primary" to="/auth/login/">Sign In</Link>)
    );

    return (
      <header>
        <div className="container">
          <Link className="logo" to="/">
            Receptionist
          </Link>
        </div>
      </header>
    )
  }
}

export default connect(
  ({session}) => ({
    session,
  }),
  { logout, })(Header)
