import { getBabyById } from "../apis";
import { TopicModeType, TopicOriginType } from "../types";
import { SET_CREATOR_DATA } from "./actions";

const now = new Date()
const initialState = {
  bid: 0,
  title: '',
  fee: 10,
  timeSelected: 5,
  topicMode: TopicModeType.OPTION,
  topicOrigin: TopicOriginType.SOUL,
  topicCount: 3,
  classesSelectList: [],
  topicIdList: [],
  book: null,
  level: null,
  know: {},
  subKnow: {},
  correctPrecent: 20,
  personCount: 1,
  desc: "",
  isShare: false,
  openState: 0,
  username: '',
  isPay: false,
  originName: '',
  originId: 0,
  startTime: Math.floor(now.getTime() / 300000) * 300,
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
    wincount: baby.wincount,
    startTime: baby.startt,
    isPay: baby.isPay,
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

export function setOrgInfo(orgInfo = {}) {
  return {
    type: SET_CREATOR_DATA,
    data: {
      originId: orgInfo.orgid,
      originName: orgInfo.orgname,
    }
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
