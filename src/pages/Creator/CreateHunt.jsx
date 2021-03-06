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
import { BackIcon, Center, Margin, Padding } from "../../styles";
import { MobilePageLayout } from "./MobilePageLayout";
import { getStartCreateBaby, saveOneBaby } from "../../apis";
import { TopicModeType, TopicOriginType } from "../../types";
import { useDispatch } from "react-redux";
import { editBaby, loadBabyData, setCreatorData, setOrgInfo } from "../../reducers/creator";
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
  { label: '5???', value: 5 },
  { label: '10???', value: 10 },
  { label: '30???', value: 30 },
  { label: '1??????', value: 60 },
  { label: '2??????', value: 120 },
  { label: '5??????', value: 300 },
]

const topicTypeOptions = [
  {
    label: '????????????',
    value: TopicOriginType.SOUL
  },
  {
    label: '?????????',
    value: TopicOriginType.KNOW
  },
  {
    label: '??????',
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
  const { onSubmit, editBid } = props
  const { creator, user } = useSelector(state => state)
  const dispatch = useDispatch()
  const { timeSelected, openState, topicMode, topicOrigin, topicCount, classesSelectList, topicIdList, book, level, subKnow, know, title, fee, correctPrecent, personCount, desc, isShare, bid, startTime, originId, originName } = creator
  const { isvip } = user
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
  const setPersonCount = v => {
    dispatch(setCreatorData({ personCount: v }))
  }
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
  const [minFee, setMinFee] = useState(1)
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
      const { levels, books, knows, orginfo = {}, baby } = res.data

      if (editBid) {
        dispatch(editBaby(editBid))
      } else if (baby) {
        dispatch(loadBabyData(baby))
      }

      dispatch(setOrgInfo(orginfo))
      const { classes } = orginfo
      let bookOptions = books.map(book => ({ label: book.name, value: book.id }))
      let levelOptions = levels.map(level => ({ label: level.name, value: level.num }))
      let knowOptions = knows.map(know => ({ label: know.name, value: know.id, subs: know.subs }))
      let classesOptions = classes.map(cls => ({ label: cls.name, value: cls.classid }))
      setBookOptions(bookOptions)
      setLevelOptions(levelOptions)
      setLevelChooseOptions(levelOptions)
      setLevel(levelOptions[0].value)
      setClassesOptions(classesOptions)
      setKnowOptions(knowOptions)
      updateSubKnowOptions(knowOptions[0])
    })()
  }, [])

  useEffect(() => {
    const isEmptyObj = Object.keys(subKnow).length === 0

    if (isEmptyObj) {
      return
    }

    if (!know || Object.keys(know).length === 0) {
      const knowName = subKnow.name.split(":")[0] || ''
      const option = knowOptions.find(op => op.label === knowName)
      if (option) {
        setKnow(option)
      }
    }

    const { minlevel, maxlevel } = subKnow
    const newLevelOptions = levelOptions.filter(option => option.value > minlevel && option.value < maxlevel)
    setLevelChooseOptions(newLevelOptions)
    if (newLevelOptions.find(o => o.value !== level)) {
      setLevel(newLevelOptions[0].value)
    }
  }, [subKnow])

  const handleTopicModeChange = (value, option) => {
    setTopicOrigin(value)
    setLevelChooseOptions(levelOptions)

    if (value === TopicOriginType.BOOK) {
      if (bookOptions.length > 0) {
        setBook(bookOptions[0].value)
      }
    }
  }

  const onKnowChange = (value, option) => {
    const subs = (option?.subs || [])
    setKnow(option)
    updateSubKnowOptions(option)
  }

  const updateSubKnowOptions = (option) => {
    const options = option.subs.map(sub => ({ label: sub.name, value: sub.id, ...sub }))
    setSubKnowOptions(options)

    const isEmptyObj = Object.keys(subKnow).length === 0
    if (isEmptyObj && options.length > 0) {
      setSubKnow(options[0])
    }
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
    formData.orgid = originId

    if (openState === 2) {
      formData.cids = JSON.stringify(classesSelectList)
    }


    let emptyValOfKey = getObjectEmptyKey(formData)
    const errTipMaps = {
      name: '*???????????????????????????',
      fee: '*?????????????????????',
      usercount: '*????????????????????????',
      okper: '*?????????????????????',
    }



    let errMsg = null
    if (personCount > Number(fee)) {
      errMsg = '??????????????????????????????'
    } else {
      errMsg = errTipMaps[emptyValOfKey]
    }

    if (errMsg) {
      setErrMsg(errMsg)
      return
    }

    const res = await saveOneBaby({ bdata: JSON.stringify(formData), bid })
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
      <Header level="1">????????????</Header>
      <ContentBox>
        <Input value={title} onChange={setTitle} maxlength={10} size="large" placeholder="????????????(???10???)" />
        <FormHeader>
          <span></span>
          <Header level="4">
            {
              topicMode === TopicModeType.OPTION
                ?
                '????????????'
                :
                '????????????'
            }
          </Header>

          <SubCovertControl onClick={changeSelectTopicMode}>
            <Icon size={1.5} src={covertImg} />
            <span>??????</span>
          </SubCovertControl>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          {
            topicMode === TopicModeType.OPTION
              ?
              (
                <>
                  <FormItem key="origin" label="????????????">
                    <Select options={topicTypeOptions} selected={topicOrigin} onSelected={handleTopicModeChange} />
                  </FormItem>
                  {topicOriginRestElem}
                  <FormItem key="difficult" label="????????????">
                    <Select options={levelChooseOptions} selected={level} onSelected={setLevel} />
                  </FormItem>
                  <FormItem key="tcount" label="????????????">
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
                        <span>????????????:</span>
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
          <FormItem label="????????????">
            <Select options={timeOptions} selected={timeSelected} onSelected={setTimeSelected} />
          </FormItem>
        </Form>
        <FormHeader>
          <span></span>
          <Header level="4">????????????</Header>
          <span></span>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          <FormItem label="?????????">
            <Input width="5em" fullwidth={false} value={fee} onChange={setFee} type="number" max={10000} min={1} />
            <Unit>???<span className="w">(?????????{isShare ? '10%' : '2%'})</span></Unit>
          </FormItem>
          <FormItem label="???????????????">
            <Input width="5em" fullwidth={false} value={correctPrecent} onChange={setCorrectPrecent} type="number" max={100} min={0} />
            <Unit>%</Unit>
          </FormItem>
          <FormItem label="????????????">
            <Input width="5em" fullwidth={false} value={personCount} onChange={setPersonCount} type="number" min={1} max={10000} />
            <Unit>???</Unit>
          </FormItem>
        </Form>

        {
          originId == 0
            ?
            null
            :
            <>
              <Header level="4">????????????</Header>
              <RadioList>
                <RadioGroup value={openState} onChange={setOpenState} name="rr">
                  <Padding v="0.5rem">
                    <Radio size="medium" value={0}>?????????????????????</Radio>
                  </Padding>
                  <Padding v="0.5rem">
                    <Radio size="medium" value={1}>?????????{originName}???</Radio>
                  </Padding>
                  <Padding v="0.5rem">
                    <Radio size="medium" value={2}>???????????????????????????</Radio>
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
            </>
        }

        <Header level="4">??????</Header>
        <Editor disabled={isvip} value={desc} onChange={setDesc} style={{ marginBottom: '1em' }} />
        <FormHeader>
          <span></span>
          <Header level="4">????????????</Header>
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
          <Checkbox onChange={setIsShare} checked={isShare}>?????????101??????????????????10%???</Checkbox>
        </Margin>
        {errMsg && <ErrMsgBox>{errMsg}</ErrMsgBox>}
        <Center>
          <Button width='7rem' onClick={handleSubmit}>??????</Button>
        </Center>
      </ContentBox>
    </MobilePageLayout>
  )
}

export default CreateHunt
