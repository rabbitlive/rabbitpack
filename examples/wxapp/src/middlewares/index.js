import { applyMiddleware, compose } from 'redux'
import thunkMiddleware     from 'redux-thunk'
import loggerMiddleware    from 'redux-logger'

const composeEnhancers = __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        
      }) : compose

console.log(composeEnhancers)

export default composeEnhancers(
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware()
  )
)
