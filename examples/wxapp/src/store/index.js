import { createStore, compose } from 'redux'
import reducers                 from './../reducers'
import middlewares              from './../middlewares'

const enhancer = compose(middlewares)

export default createStore(reducers, enhancer)



