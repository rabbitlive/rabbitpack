import { applyMiddleware } from 'redux'
import thunkMiddleware     from 'redux-thunk'
import loggerMiddleware    from 'redux-logger'

export default applyMiddleware(
  thunkMiddleware,
  loggerMiddleware()
)
