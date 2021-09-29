import { getBabyById } from "../apis";
import { TopicModeType, TopicOriginType } from "../types";
import { SET_CREATOR_DATA } from "./actions";

const initialState = {
  bid: 0,
  title: '',
  fee: 1,
  timeSelected: 5,
  topicMode: TopicModeType.OPTION,
  topicOrigin: TopicOriginType.SOUL,
  topicCount: 1,
  classesSelectList: [],
  topicIdList: [],
  book: null,
  level: null,
  know: {},
  subKnow: {},
  correctPrecent: 0,
  personCount: 1,
  desc: "",
  isShare: false,
  openState: 0,
  username: ''
}

export function setCreatorData(data) {
  return {
    type: SET_CREATOR_DATA,
    data
  }
}

export function editBaby(id) {
  return async dispatch => {
    const res = await getBabyById(id)
    if (res.data.result === 0) {
      dispatch(loadBabyData(res.data.baby))
    }

    return Promise.resolve(res.data.result)
  }
}

export function loadBabyData(baby) {

  const data = {
    topicMode: baby.selecttype,
    bid: baby.id,
    title: baby.name,
    fee: baby.fee,
    timeSelected: baby.qtime,
    topicOrigin: baby.qrange,
    topicCount: baby.qnumber,
    classesSelectList: baby.orginfo.cids,
    topicIdList: baby.qids,
    level: baby.qlevel,
    correctPrecent: baby.okper,
    personCount: baby.usercount,
    desc: baby.desc,
    isShare: baby.isshare,
    openState: baby.sharetype,
    username: baby.username,
    wincount: baby.wincount
  }

  if (data.topicOrigin === TopicOriginType.BOOK) {
    data.book = baby.qtypeid
  } else if (data.topicOrigin === TopicOriginType.KNOW) {
    data.subKnow = baby.qtypeid
  }

  //subKnow
  return {
    type: SET_CREATOR_DATA,
    data
  }
}

export default (state = initialState, action) => {
  const { type, data } = action

  switch (type) {
    case SET_CREATOR_DATA:
      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}
