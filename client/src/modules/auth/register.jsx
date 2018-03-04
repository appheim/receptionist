import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { register } from '../session/'
import { InputCustom } from '../../components/form/input-custom'
import { validate } from '../../components/form/validate'
import { Button } from 'semantic-ui-react'

class RegisterPage extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="auth sign-up">
        <div className="container">
          <form onSubmit={handleSubmit} className="form-register">
            <Field
              name="email"
              placeholder="Email"
              component={InputCustom}
              type="email" />
            <Field
              name="full_name"
              placeholder="Full name"
              component={InputCustom}
              type="text" />
            <Field
              name="password"
              placeholder="Password (minimum 8 characters)"
              component={InputCustom}
              type="password" />
            <Button primary type="submit">SIGN UP</Button>
          </form>
          <p className="note">Already have an account? <Link className="link" to="/auth/login/">Sign In</Link></p>
        </div>
      </div>
    );
  }
}

const registerForm = reduxForm({
  form: 'register',
  validate,
})(RegisterPage);

export default connect(
  ({session}) => ({
    session,
  }),
  {
    onSubmit: register,
  }
)(registerForm)

