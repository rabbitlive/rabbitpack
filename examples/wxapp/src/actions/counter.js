export const ActionType = {
  COUNTER_INC: 'COUNTER_INC',
  COUNTER_DEC: 'COUNTER_DEC'
}

export function counterInc() {
  return {
    type: ActionType.COUNTER_INC
  }
}

export function counterDec() {
  return {
    type: ActionType.COUNTER_DEC
  }
}
