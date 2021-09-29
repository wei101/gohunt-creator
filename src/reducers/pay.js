import { payOk } from "../apis"
import { SET_PAY_DATA } from "./actions"

const initialState = {
  payDone: false,
}

export function doPay(bid, callback) {
  return async dispatch => {
    const res = await payOk(bid)
    const isOk = (res?.data.result === 0) || false
    dispatch({
      type: SET_PAY_DATA,
      data: {
        payDone: isOk
      }
    })
    callback && callback(isOk)
  }
}

export function setPayData(payData) {
  return {
    type: SET_PAY_DATA,
    data: {
      payData
    }
  }
}

export default (state = initialState, action) => {
  const { type, data } = action

  switch (type) {
    case SET_PAY_DATA:
      return {
        ...state,
        ...data.payData
      }
    default:
      return state
  }
}
