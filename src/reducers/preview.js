import { deleteOneQuestion } from "../apis";
import { DELETE_TOPIC_BY_ID, SET_CREATOR_DATA, SET_TOPICS } from "./actions";

const initialState = {
  topics: []
}

export function setTopics(data) {
  return {
    type: SET_TOPICS,
    data
  }
}

export function deleteTopicById(topicId, bid) {
  return async dispatch => {
    const res = await deleteOneQuestion({
      qid: topicId,
      bid
    })

    if (res.status === 200) {
      dispatch({
        type: DELETE_TOPIC_BY_ID,
        data: {
          topicId
        }
      })
    }
  }
}

export default (state = initialState, action) => {
  const { type, data } = action

  switch (type) {
    case SET_TOPICS:
      return {
        ...state,
        topics: data
      }
    case DELETE_TOPIC_BY_ID:
      const newTopics = [...state.topics]
      const shouldDeleteTopicIndex = newTopics.findIndex(topic => topic.qid === data.topicId)
      if (shouldDeleteTopicIndex > -1) {
        newTopics.splice(shouldDeleteTopicIndex, 1)
      }
      return {
        ...state,
        topics: newTopics
      }
    default:
      return state
  }
}
