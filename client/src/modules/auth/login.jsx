import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../session/'
import { InputCustom } from '../../components/form/input-custom'
import { validate } from '../../components/form/validate'
import { Button } from 'semantic-ui-react'

class LoginPage extends Component {

  render() {
    const { handleSubmit } = this.props
    return (
      <div className='auth'>
        <div className='container'>
          <h2 className='title'>Sign In</h2>
          <div className='col right-div'>
            <form onSubmit={handleSubmit} className='form-login'>
              <Field
                name='email'
                placeholder="Email"
                component={InputCustom}
                type='email' />
              <Field
                name='password'
                placeholder="Password (minimum 8 characters)"
                component={InputCustom}
                type='password' />
              <Button primary type='submit'>SIGN IN</Button>
              <Link to='/auth/reset-password/' className='link'>Forgot password?</Link>
            </form>
          </div>
          <p className='note'>Don't have an account? <Link className='link' to='/auth/register/'>Sign Up</Link></p>
        </div>
      </div>
    )
  }
}

const loginForm = reduxForm({
  form: 'login',
  validate
})(LoginPage)

export default connect(
  ({session}) => ({
    session
  }),
  {
    onSubmit: login,
  }
)(loginForm)
