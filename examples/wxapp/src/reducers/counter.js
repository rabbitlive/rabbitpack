import { ActionType } from '../actions/counter'

export const initState = {
  value: 5,
  max: 10,
  min: 0
}

export default function(state = initState, action) {
  const { type, payload } = action
  
  switch(type) {
  case ActionType.COUNTER_INC:
    return Object.assign({}, state, {
      value: Math.min(state.max, state.value + 1)
    })

  case ActionType.COUNTER_DEC:
    return Object.assign({}, state, {
      value: Math.max(state.min, state.value - 1)
    })

  default: return state
  }
}
