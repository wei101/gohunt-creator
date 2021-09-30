import styled from "styled-components"

export const TopicModeType = {
    OPTION: 0,
    INPUT: 1,
}

export const TopicOriginType = {
    SOUL: 0,
    KNOW: 1,
    BOOK: 2,
}

export const HuntRangeType = {
    0: '公开给所有棋友',
    1: '公开给教室内部学生',
    2: '公开给指定班级学生',
}

export const HuntCardRangeType = {
    0: '全体棋友可见',
    1: '仅本教室学生可见',
    2: '仅部分班级可见',
}

export const StateTipMaps = {
    0: '',
    1: '进行中',
    2: '已结束',
}

const OpenStatus = styled.span`
    background-color: #55d68f;
    color: white;
`

const EndStatus = styled.span`
    color: #DB6933;
    background-color: #ffe476;
`
const CreateStatus = styled.div`
    color: #603708;
    background-color: #ffe476;
    width: 11em !important;
    margin: 0.4em 0 !important;
`

export const StateTipSpanMaps = {
    0: CreateStatus,
    1: OpenStatus,
    2: EndStatus,
}
