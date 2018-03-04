export const validate = values => {
  const errors = {};

  if (!values.full_name) {
    errors.full_name = 'This field is required';
  }

  if (!values.email) {
    errors.email = 'This field is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Wrong email format';
  }

  if (!values.password) {
    errors.password = 'This field is required';
  } else if (values.password.toString().split('').length < 8) {
    errors.password = 'Wrong email format';
  }

  if (!values.repeat_password) {
    errors.repeat_password = 'This field is required';
  } else if (values.password !== values.repeat_password) {
    errors.repeat_password = "Passwords don't match";
  }

  return errors
}
