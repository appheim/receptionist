import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { resetPassword } from '../session/'
import { InputCustom } from '../../components/form/input-custom'
import { validate } from '../../components/form/validate'
import { Button } from 'semantic-ui-react'

class ResetPasswordPage extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="auth">
        <div className="container">
          <h2 className="title">Reset Password</h2>
          <p className="desc min">Enter your email address:</p>
          <form onSubmit={handleSubmit}>
            <Field
              name="email"
              placeholder="Email"
              component={InputCustom}
              type="email" />
            <Button primary type="submit">SEND</Button>
          </form>
        </div>
      </div>
    );
  }
}

const resetPasswordForm = reduxForm({
  form: 'resetPassword',
  validate,
})(ResetPasswordPage);

export default connect(
  ({session}) => ({
    session,
  }),
  {
    onSubmit: resetPassword,
  }
)(resetPasswordForm)


