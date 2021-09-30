import { payOk } from "../apis"
import { SET_PAY_DATA, SET_USER_DATA } from "./actions"

const initialState = {
  username: '',
  isvip: false
}

export function setUserData(userData) {
  return {
    type: SET_USER_DATA,
    data: {
      userData
    }
  }
}

export default (state = initialState, action) => {
  const { type, data } = action

  switch (type) {
    case SET_USER_DATA:
      return {
        ...state,
        ...data.userData
      }
    default:
      return state
  }
}
