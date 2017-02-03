import { compose } from 'redux'
import { connect } from 'wxapp-redux'
import * as action from '../../actions/counter'
import style from '../../styles/counter.css'

function mapStateToProps(state) {
  return {
    counter: state.counter.value
  }
}

function mapDispatchToProps(dispatch) {
  return {
    inc: compose(dispatch, action.counterInc),
    dec: compose(dispatch, action.counterDec)
  }
}


connect(mapStateToProps, mapDispatchToProps)({}, style)
