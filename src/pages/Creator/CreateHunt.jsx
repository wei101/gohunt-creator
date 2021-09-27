import { useState } from "react/cjs/react.development";
import styled from "styled-components";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import Form, { FormItem } from "../../components/Form";
import Editor from "../../components/forms/Editor";
import Input from "../../components/forms/Input";
import Radio from "../../components/forms/Radio";
import Select from "../../components/forms/Select";
import Header from "../../components/Header";
import Icon from "../../components/Icon";
import covertImg from "../../images/convert.png"
import deleteImg from "../../images/delete.png"
import addImg from "../../images/add.png"
import { Center } from "../../styles";
import { MobilePageLayout } from "./MobilePageLayout";

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
`

const SubRadois = styled(RadioList)`
  padding-left: 2em;

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

const timeOptions = [
  { label: '5秒', value: 5 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '1分钟', value: 60 },
  { label: '2分钟', value: 120 },
  { label: '5分钟', value: 300 },
]

const TopicModeType = {
  OPTION: 0,
  INPUT: 1
}

function CreateHunt({ onSubmit }) {
  const [selected, setSelected] = useState(1)
  const [timeSelected, setTimeSelected] = useState(1)

  const [topicMode, setTopicMode] = useState(TopicModeType.OPTION)
  const [topicCount, setTopicCount] = useState(0)
  const [checked, setChecked] = useState(false)
  const [topicId, setTopicId] = useState('')
  const [topicIdList, setTopicIdList] = useState([])

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

  const [fee, setFee] = useState(0)
  const [correctPrecent, setCorrectPrecent] = useState(0)
  const [pcount, setPCount] = useState(0)
  const options = [
    { label: '101精品题库', value: 1 },
    { label: '101题库', value: 2 },
    { label: '101题库精选十九点', value: 3 },
    { label: '101题库', value: 4 },
    { label: '101题库', value: 5 },
  ]

  const changeSelectTopicMode = () => {
    setTopicMode(topicMode === TopicModeType.OPTION ? TopicModeType.INPUT : TopicModeType.OPTION)
  }

  return (
    <MobilePageLayout>
      <Header level="1">创建宝藏</Header>
      <ContentBox>
        <Input maxlength={10} size="large" placeholder="宝藏名称(限10字)" />
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
                  <FormItem label="题目来源">
                    <Select options={options} selected={selected} onSelected={setSelected} />
                  </FormItem>
                  <FormItem label="题目难度">
                    <Select options={options} selected={selected} onSelected={setSelected} />
                  </FormItem>
                  <FormItem label="题目数量">
                    <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={100} min={0} />
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
            <Select options={timeOptions} selected={selected} onSelected={setSelected} />
          </FormItem>
        </Form>
        <FormHeader>
          <span></span>
          <Header level="4">宝藏奖励</Header>
          <span></span>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          <FormItem label="总金额">
            <Input width="5em" fullwidth={false} value={fee} onChange={setFee} type="number" max={1000} min={0} />
            <Unit>元<span className="w">(手续费)</span></Unit>
          </FormItem>
          <FormItem label="要求正确率">
            <Input width="5em" fullwidth={false} value={correctPrecent} onChange={setCorrectPrecent} type="number" max={100} min={0} />
            <Unit>%</Unit>
          </FormItem>
          <FormItem label="人数限制">
            <Input width="5em" fullwidth={false} value={pcount} onChange={setPCount} type="number" max={100} min={0} />
            <Unit>人</Unit>
          </FormItem>
        </Form>


        <Header level="4">公开范围</Header>
        <RadioList>
          <Radio name="op" size="mini" checked={checked} onChange={setChecked}>公开给所有棋友</Radio>
          <Radio name="op" size="mini" checked={checked} onChange={setChecked}>公开给测试用</Radio>
          <Radio name="op" size="mini" checked={checked} onChange={setChecked}>公开给指定班级学生</Radio>
          <SubRadois>
            <Checkbox size="mini" checked={checked} onChange={setChecked}>测试班级1</Checkbox>
            <Checkbox size="mini" checked={checked} onChange={setChecked}>测试班级2</Checkbox>
            <Checkbox size="mini" checked={checked} onChange={setChecked}>测试班级3</Checkbox>
          </SubRadois>
        </RadioList>
        <Header level="4">说明</Header>
        <Editor style={{ marginBottom: '1em' }} />
        <div>
          <Checkbox size="0.8">分享到101平台（手续费20%）</Checkbox>
        </div>
        <Center>
          <Button width='5em' onClick={onSubmit}>预览</Button>
        </Center>
      </ContentBox>
    </MobilePageLayout>
  )
}

export default CreateHunt
