import { combineReducers } from 'redux'
import appReducer          from './app'
import counterReducer      from './counter'

export default combineReducers({
  app:     appReducer,
  counter: counterReducer
})
