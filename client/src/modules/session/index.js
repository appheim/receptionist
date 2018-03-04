import { createAction } from 'redux-actions'
import { push } from 'react-router-redux'
import { showNotification } from '../../components/message/reducers'
import API from '../../api'

const SESSION_USER_UPDATE = Symbol('SESSION_USER_UPDATE')
const SESSION_USER_LOGOUT = Symbol('SESSION_USER_LOGOUT')

const updateSession = createAction(SESSION_USER_UPDATE)
const logout = createAction(SESSION_USER_LOGOUT)

const login = function (credentials) {
  return function (dispatch, getState, { API }) {
    return API('login/')
      .post(credentials)
      .then(data => {
        dispatch(updateSession(data))
      })
  }
}

const register = function (credentials) {
  return function (dispatch, getState, { API }) {
    return API('users/')
      .post(credentials)
      .then(data => {
        dispatch(updateSession(data))
        dispatch(showNotification(
        {
          title: 'Thanks for Signing Up',
          text: 'We have created your account.'
        }))
      })
  }
}

const resetPassword = function (credentials) {
  return function (dispatch, getState, { API }) {
    return API('users/password/reset/')
      .post(credentials)
      .then(data => {
        dispatch(showNotification({ title: 'Change Password', text: 'Please check your email.' }))
      })
  }
}

export {
  updateSession,
  login,
  register,
  logout,
  resetPassword,
}

const defaultState = {
  token: null,
  user: {},
}

function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case SESSION_USER_UPDATE:
      return {
        ...state,
        ...payload
      }
    case SESSION_USER_LOGOUT:
      return { ...defaultState }
    default:
      return state;
  }
}

const reducers = { session: reducer }

export { reducers }
