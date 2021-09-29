import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Form, { FormItem } from "../../components/Form";
import Editor from "../../components/forms/Editor";
import Input from "../../components/forms/Input";
import Radio, { RadioGroup } from "../../components/forms/Radio";
import Select from "../../components/forms/Select";
import Header from "../../components/Header";
import Icon from "../../components/Icon";
import covertImg from "../../images/convert.png"
import deleteImg from "../../images/delete.png"
import addImg from "../../images/add.png"
import { Center, Margin, Padding } from "../../styles";
import { MobilePageLayout } from "./MobilePageLayout";
import { getStartCreateBaby, saveOneBaby } from "../../apis";
import { TopicModeType, TopicOriginType } from "../../types";
import { useDispatch } from "react-redux";
import { loadBabyData, setCreatorData } from "../../reducers/creator";
import { useSelector } from "react-redux";
import { arrToSeconds, getObjectEmptyKey, parseSeconds } from "../../utils";
import { setTopics } from "../../reducers/preview";
import Modal from "../../components/Modal";

const ContentBox = styled.div`
  padding: 1em 2em;
  overflow-y: auto;
  height: 0;
  flex: 1;
`

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
`

const SubCovertControl = styled(Center)`
  font-size: 0.9rem;
  color: #603708;
  font-weight: bold;
  cursor:pointer;
`

const RadioList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.8rem 0;
  font-weight: bold;
`

const SubRadois = styled(RadioList)`
  padding-left: 1rem;
  font-weight: normal;

  & > * {
    margin-bottom: 0.5rem;
  }
`

const Unit = styled.span`
  font-size: 0.9em;
  color: #603708;
  margin-left: 0.4em;
  font-weight: bold;

  .w {
    font-weight: normal;
  }
`

const AddTopicBox = styled.div`
  display: inline-flex;
  align-items: center;
`

const AddTopicInputWrapper = styled.div`
  flex: 1;
  margin-right: 0.5em;

`

const TopicIdList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-size: 0.8em;
  color: #603708;
  font-weight: bold;
  margin: 1em 0;
`

const TopicIdItem = styled.div`
  display: flex;
  align-items:center;
  justify-content: space-between;
  padding-right: 0.5em;
`

const ErrMsgBox = styled(Center)`
  color: #F16013;
  font-size: 0.75rem;
  margin-top: 1rem;
`

const timeOptions = [
  { label: '5秒', value: 5 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '1分钟', value: 60 },
  { label: '2分钟', value: 120 },
  { label: '5分钟', value: 300 },
]

const topicTypeOptions = [
  {
    label: '精品题库',
    value: TopicOriginType.SOUL
  },
  {
    label: '知识点',
    value: TopicOriginType.KNOW
  },
  {
    label: '题书',
    value: TopicOriginType.BOOK
  }
]

const PublishDateSelectBox = styled.div`
  display: flex;
  justify-items: stretch;

  & > div {
    flex: 1;
    margin-right: 0.2rem;
  }
`

const yearOptions = [2021, 2022, 2023].map((i) => ({
  label: i,
  value: i
}))

const monthOptions = new Array(12).fill(0).map((_, i) => ({
  label: i + 1,
  value: i + 1
}))

const dateOptions = new Array(31).fill(0).map((_, i) => ({
  label: i + 1,
  value: i + 1
}))

const hourOptions = new Array(24).fill(0).map((_, i) => ({
  label: i,
  value: i
}))

const minuteOptions = new Array(12).fill(0).map((_, i) => ({
  label: i * 5,
  value: i * 5
}))

function CreateHunt(props) {
  const { onSubmit } = props
  const creator = useSelector(state => state.creator)
  const dispatch = useDispatch()
  const { timeSelected, openState, topicMode, topicOrigin, topicCount, classesSelectList, topicIdList, book, level, subKnow, know, title, fee, correctPrecent, personCount, desc, isShare, bid, startTime } = creator
  const setTimeSelected = v => dispatch(setCreatorData({ timeSelected: v }))
  const setTopicMode = v => dispatch(setCreatorData({ topicMode: v }))
  const setTopicOrigin = v => dispatch(setCreatorData({ topicOrigin: v }))
  const setTopicCount = v => dispatch(setCreatorData({ topicCount: v }))
  const setClassesSelectList = v => dispatch(setCreatorData({ classesSelectList: v }))
  const setTopicIdList = v => dispatch(setCreatorData({ topicIdList: v }))
  const setBook = v => dispatch(setCreatorData({ book: v }))
  const setLevel = v => dispatch(setCreatorData({ level: v }))
  const setSubKnow = v => dispatch(setCreatorData({ subKnow: v }))
  const setKnow = v => dispatch(setCreatorData({ know: v }))
  const setTitle = v => dispatch(setCreatorData({ title: v }))
  const setFee = v => dispatch(setCreatorData({ fee: v }))
  const setCorrectPrecent = v => dispatch(setCreatorData({ correctPrecent: v }))
  const setPersonCount = v => dispatch(setCreatorData({ personCount: v }))
  const setIsShare = v => dispatch(setCreatorData({ isShare: v }))
  const setDesc = v => dispatch(setCreatorData({ desc: v }))
  const setOpenState = v => dispatch(setCreatorData({ openState: v }))
  const setStartTime = v => dispatch(setCreatorData({ startTime: v }))
  const [topicId, setTopicId] = useState('')
  const [bookOptions, setBookOptions] = useState([])
  const [levelOptions, setLevelOptions] = useState([])
  const [levelChooseOptions, setLevelChooseOptions] = useState([])
  const [classesOptions, setClassesOptions] = useState([])
  const [knowOptions, setKnowOptions] = useState([])
  const [subKnowOptions, setSubKnowOptions] = useState([])
  const [errMsg, setErrMsg] = useState('')
  const [publishTimes, setPublishTimes] = useState([yearOptions[0].value, monthOptions[0].value, dateOptions[0].value, hourOptions[0].value, minuteOptions[0].value])

  const [publishYearOptions, setPublishYearOptions] = useState(yearOptions)
  const [publishMonthOptions, setPublishMonthOptions] = useState(monthOptions)
  const [publishDateOptions, setPublishDateOptions] = useState(dateOptions)
  const [publishHourOptions, setPublishHourOptions] = useState(hourOptions)
  const [publishMinuteOptions, setPublishMinuteOptions] = useState(minuteOptions)

  const updatePublishTimes = (value, index) => {
    const newTimes = [...publishTimes]
    newTimes[index] = value
    setPublishTimes(newTimes)
  }
  // useEffect(() => {
  //   const now = new Date()
  //   const year = publishTimes[0]
  //   if (year === now.getFullYear) {
  //     const nowMonth = now.getMonth()
  //     const newYearsOptions = new Array(12 - nowMonth).fill(0).map((_, i) => ({
  //       label: i + nowMonth + 1,
  //       value: i + nowMonth
  //     }))

  //     set
  //   }
  // }, [publishYearOptions])

  // const updatePublishTimesOptions = () => {
  //   const [year, month, date, hour, minute] = publishTimes
  //   const newPublishTime = [...publishTimes]
  //   const newPublishTimeOptions = [...publishTimesOptions]

  //   const nowMonth = now.getMonth()
  //   if (year === now.getFullYear()) {
  //     newPublishTimeOptions[1] = new Array(12 - nowMonth).fill(0).map((_, i) => ({
  //       label: i + nowMonth + 1,
  //       value: i + nowMonth
  //     }))
  //     newPublishTime[1] = nowMonth
  //     const nowDate = now.getDate()
  //     if (month === nowMonth) {
  //       const maxDateInNowMonth = new Date(year, month, 0).getDate()
  //       newPublishTimeOptions[2] = new Array(maxDateInNowMonth - nowDate).fill(0).map((_, i) => ({
  //         label: i + nowDate,
  //         value: i + nowMonth
  //       }))
  //       newPublishTime[2] = nowDate
  //     }


  //     setPublishOptions(newPublishTimeOptions)
  //     setPublishTimes(newPublishTime)
  //   }
  // }

  useEffect(() => {
    if (startTime) {
      const pt = parseSeconds(startTime)
      setPublishTimes(pt)
    }
  }, [startTime])

  useEffect(() => {

    (async () => {
      const res = await getStartCreateBaby()
      console.log(res);
      const { levels, books, knows, orginfo, baby } = res.data
      if (baby) {
        dispatch(loadBabyData(baby))
      }
      const { classes } = orginfo
      let bookOptions = books.map(book => ({ label: book.name, value: book.id }))
      let levelOptions = levels.map(level => ({ label: level.name, value: level.num }))
      let knowOptions = knows.map(know => ({ label: know.name, value: know.id, subs: know.subs }))
      let classesOptions = classes.map(cls => ({ label: cls.name, value: cls.classid }))
      console.log(knowOptions);
      setBookOptions(bookOptions)
      setLevelOptions(levelOptions)
      setLevelChooseOptions(levelOptions)
      setLevel(levelOptions[0].value)
      setClassesOptions(classesOptions)
      setKnowOptions(knowOptions)
    })()
  }, [])

  useEffect(() => {
    if (!subKnow) {
      return
    }

    if (!know) {
      const knowName = subKnow.name.split(":")[0] || ''
      const option = knowOptions.find(op => op.label === knowName)
      if (option) {
        setKnow(option)
      }
    }

    const { minlevel, maxlevel } = subKnow
    const newLevelOptions = levelOptions.filter(option => option.value > minlevel && option.value < maxlevel)
    setLevelChooseOptions(newLevelOptions)
  }, [subKnow])

  const handleTopicModeChange = (value, option) => {
    setTopicOrigin(value)
    setLevelChooseOptions(levelOptions)
  }

  const onKnowChange = (value, option) => {
    const subs = (option?.subs || [])
    setKnow(option)
    setSubKnowOptions(subs.map(sub => ({ label: sub.name, value: sub.id, ...sub })))
  }

  const onSubKnowChange = (value, option) => {
    setSubKnow(option)
  }

  const deleteTopicById = id => {
    const topicIndex = topicIdList.indexOf(id)
    let newTopicIdList = [...topicIdList]
    newTopicIdList.splice(topicIndex, 1)
    setTopicIdList(newTopicIdList)
  }

  const addTopicId = () => {
    if (topicId !== '' && topicIdList.indexOf(topicId) === -1) {
      setTopicIdList([...topicIdList, topicId])
      setTopicId('')
    }
  }

  const handleClassesSelectList = (checked, value) => {
    const index = classesSelectList.indexOf(value)
    const newList = [...classesSelectList]
    if (index > -1 && !checked) {
      newList.splice(index, 1)
      setClassesSelectList(newList)

    } else if (index === -1 && checked) {
      newList.push(value)
      setClassesSelectList(newList)
    }
  }

  const changeSelectTopicMode = () => {
    setTopicMode(topicMode === TopicModeType.OPTION ? TopicModeType.INPUT : TopicModeType.OPTION)
  }

  const getLevelFormData = () => {

    const result = {
      qlevel: level,
      qnumber: topicCount,
      qids: JSON.stringify([]),
      qrange: topicOrigin
    }

    if (topicOrigin === TopicOriginType.BOOK) {
      result.qtypeid = book
    } else if (topicOrigin === TopicOriginType.KNOW) {
      console.log(subKnow);
      result.qtypeid = subKnow.value
    }

    return result
  }

  const getQIDFormData = () => {
    return {
      qids: JSON.stringify(topicIdList),
    }
  }

  const handleSubmit = async () => {
    let formData = topicMode === TopicModeType.OPTION ?
      getLevelFormData() :
      getQIDFormData()
    formData.name = title
    formData.fee = fee
    formData.okper = correctPrecent
    formData.usercount = personCount
    formData.qtime = timeSelected
    formData.desc = desc
    formData.isshare = isShare
    formData.sharetype = openState
    formData.selecttype = topicMode
    formData.myear = publishTimes[0]
    formData.mmonth = publishTimes[1]
    formData.mday = publishTimes[2]
    formData.mhour = publishTimes[3]
    formData.mminute = publishTimes[4]

    if (openState === 2) {
      formData.cids = JSON.stringify(classesSelectList)
    }


    const emptyValOfKey = getObjectEmptyKey(formData)
    const errTipMaps = {
      name: '*宝藏名称不允许为空',
      fee: '*需要填写总金额',
      usercount: '*需要填写人数限制',
      okper: '*需要填写正确率',
    }

    const errMsg = errTipMaps[emptyValOfKey]
    if (errMsg) {
      setErrMsg(errMsg)
      return
    }

    const res = await saveOneBaby({ bdata: JSON.stringify(formData), bid })
    console.log(res);
    dispatch(loadBabyData(res.data.baby))
    dispatch(setTopics(res.data.qs))
    onSubmit()
  }


  let topicOriginRestElem = [null]
  if (topicOrigin === TopicOriginType.KNOW) {
    topicOriginRestElem = [
      <FormItem key="knows" label="">
        <Select options={knowOptions} selected={know?.value} onSelected={onKnowChange} />
      </FormItem>,
      <FormItem key="sub-knows" label="">
        <Select options={subKnowOptions} selected={subKnow.value} onSelected={onSubKnowChange} />
      </FormItem>
    ]
  } else if (topicOrigin === TopicOriginType.BOOK) {
    topicOriginRestElem = [
      <FormItem key="books" label="">
        <Select options={bookOptions} selected={book} onSelected={setBook} />
      </FormItem>
    ]
  }

  return (
    <MobilePageLayout>
      <Header level="1">创建宝藏</Header>
      <ContentBox>
        <Input value={title} onChange={setTitle} maxlength={10} size="large" placeholder="宝藏名称(限10字)" />
        <FormHeader>
          <span></span>
          <Header level="4">
            {
              topicMode === TopicModeType.OPTION
                ?
                '题库选题'
                :
                '编号出题'
            }
          </Header>

          <SubCovertControl onClick={changeSelectTopicMode}>
            <Icon size={1.5} src={covertImg} />
            <span>切换</span>
          </SubCovertControl>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          {
            topicMode === TopicModeType.OPTION
              ?
              (
                <>
                  <FormItem key="origin" label="题目来源">
                    <Select options={topicTypeOptions} selected={topicOrigin} onSelected={handleTopicModeChange} />
                  </FormItem>
                  {topicOriginRestElem}
                  <FormItem key="difficult" label="题目难度">
                    <Select options={levelChooseOptions} selected={level} onSelected={setLevel} />
                  </FormItem>
                  <FormItem key="tcount" label="题目数量">
                    <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={10} min={1} />
                  </FormItem>
                </>
              )
              :
              (
                <>
                  <FormItem label="Q-">
                    <AddTopicBox>
                      <AddTopicInputWrapper>
                        <Input maxlength={6} value={topicId} onChange={setTopicId} />
                      </AddTopicInputWrapper>
                      <Icon size={1.2} src={addImg} onClick={addTopicId} />
                    </AddTopicBox>
                  </FormItem>

                  {
                    topicIdList.length > 0 &&
                    (
                      <TopicIdList>
                        <span>添加题目:</span>
                        {
                          topicIdList.map(topicId => (
                            <TopicIdItem>
                              <span>{topicId}</span>
                              <Icon size={1} src={deleteImg} onClick={() => deleteTopicById(topicId)} />
                            </TopicIdItem>
                          ))
                        }
                      </TopicIdList>
                    )
                  }
                </>
              )
          }
          <FormItem label="做题时间">
            <Select options={timeOptions} selected={timeSelected} onSelected={setTimeSelected} />
          </FormItem>
        </Form>
        <FormHeader>
          <span></span>
          <Header level="4">宝藏奖励</Header>
          <span></span>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          <FormItem label="总金额">
            <Input width="5em" fullwidth={false} value={fee} onChange={setFee} type="number" max={1000} min={1} />
            <Unit>元<span className="w">(手续费)</span></Unit>
          </FormItem>
          <FormItem label="要求正确率">
            <Input width="5em" fullwidth={false} value={correctPrecent} onChange={setCorrectPrecent} type="number" max={100} min={0} />
            <Unit>%</Unit>
          </FormItem>
          <FormItem label="人数限制">
            <Input width="5em" fullwidth={false} value={personCount} onChange={setPersonCount} type="number" max={100} min={1} />
            <Unit>人</Unit>
          </FormItem>
        </Form>


        <Header level="4">公开范围</Header>
        <RadioList>
          <RadioGroup value={openState} onChange={setOpenState} name="rr">
            <Padding v="0.5rem">
              <Radio size="medium" value={0}>公开给所有棋友</Radio>
            </Padding>
            <Padding v="0.5rem">
              <Radio size="medium" value={1}>公开给测试用</Radio>
            </Padding>
            <Padding v="0.5rem">
              <Radio size="medium" value={2}>公开给指定班级学生</Radio>
            </Padding>
          </RadioGroup>
          {
            openState === 2 &&
            (
              <SubRadois>
                {
                  classesOptions.map(option => (
                    <Checkbox size="medium" checked={classesSelectList.indexOf(option.value) > -1} onChange={handleClassesSelectList} value={option.value} key={option.label}>{option.label}</Checkbox>
                  ))
                }
              </SubRadois>
            )
          }

        </RadioList>
        <Header level="4">说明</Header>
        <Editor value={desc} onChange={setDesc} style={{ marginBottom: '1em' }} />
        <FormHeader>
          <span></span>
          <Header level="4">发布时间</Header>
          <span></span>
        </FormHeader>
        <PublishDateSelectBox>
          <Select selected={publishTimes[0]} onSelected={v => updatePublishTimes(v, 0)} inline={true} options={publishYearOptions} />
          <Select selected={publishTimes[1]} onSelected={v => updatePublishTimes(v, 1)} inline={true} options={publishMonthOptions} />
          <Select selected={publishTimes[2]} onSelected={v => updatePublishTimes(v, 2)} inline={true} options={publishDateOptions} />
          <Select selected={publishTimes[3]} onSelected={v => updatePublishTimes(v, 3)} inline={true} options={publishHourOptions} />
          <Select selected={publishTimes[4]} onSelected={v => updatePublishTimes(v, 4)} inline={true} options={publishMinuteOptions} />
        </PublishDateSelectBox>
        <Margin top="2rem" bottom='1rem'>
          <Checkbox onChange={setIsShare} checked={isShare}>分享到101平台（手续费20%）</Checkbox>
        </Margin>
        <Center>
          <Button width='7rem' onClick={handleSubmit}>预览</Button>
        </Center>
        {errMsg && <ErrMsgBox>{errMsg}</ErrMsgBox>}
      </ContentBox>
    </MobilePageLayout>
  )
}

export default CreateHunt
