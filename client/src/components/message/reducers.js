import { createAction } from 'redux-actions'

const SHOW_NOTIFICATION = Symbol('SHOW_NOTIFICATION')
const HIDE_NOTIFICATION = Symbol('HIDE_NOTIFICATION')

const showNotification = createAction(SHOW_NOTIFICATION)
const hideNotification = createAction(HIDE_NOTIFICATION)


const defaultNotification = {
  isActive: false,
  title: '',
  text: '',
  error: false,
  duration: 4000,
}

const notificationReducer = (state = defaultNotification, { type, payload }) => {
  switch (type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        isActive: true,
        ...payload
      }
    case HIDE_NOTIFICATION:
      return defaultNotification
    default:
      return state;
  }
}


const reducers = { notification: notificationReducer, }

export { reducers, showNotification, hideNotification }
