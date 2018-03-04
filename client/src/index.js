'use strict';

import 'babel-polyfill'
import './scss/app.css'

import React from 'react'
import { render } from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducers as sessionReducers } from './modules/session'
import { reducers as messageReducers } from './components/message/reducers'
import { reducer as form } from 'redux-form'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { Router, Switch } from "react-router-dom";
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'

import API, { configure as configureAPI } from './api'

import AppLayout from './layouts/AppLayout'
import Homepage from './layouts/Homepage'
import AuthCheck from './modules/session/AuthCheck'

import LoginPage from './modules/auth/login'
import RegisterPage from './modules/auth/register'
import ResetPasswordPage from './modules/auth/resetPassword'

import { NotFound } from './layouts/NotFound'

const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)


const localStorage = window.fakeStorage ? window.fakeStorage : window.localStorage;

const persistedState = { session: localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {} }

const store = createStore(
  combineReducers({
    ...sessionReducers,
    ...messageReducers,
    form,
    router: routerReducer,
  }),
  applyMiddleware(middleware),
  applyMiddleware(thunk.withExtraArgument({ API })),
  persistedState,
)

store.subscribe(() => {
  localStorage.setItem('reduxState', JSON.stringify(store.getState().session))
})

configureAPI(store)
window.store = store

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <AppLayout>
          <Route exact path="/" component={Homepage} />
          <Route path="/auth/login/" component={LoginPage} />
          <Route path="/auth/register/" component={RegisterPage} />
          <Route path="/auth/reset-password/" component={ResetPasswordPage} />
        </AppLayout>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
