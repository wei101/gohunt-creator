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

const SubCovertControl = styled.div`
  font-size: 0.9rem;
`

const RadioList = styled.div`
  display: flex;
  flex-direction: column;
`

const SubRadois = styled(RadioList)`
  padding-left: 2em;
`

function CreateHunt({ onSubmit }) {
  const [selected, setSelected] = useState(1)
  const [topicCount, setTopicCount] = useState(0)
  const options = [
    { label: '101精品题库', value: 1 },
    { label: '101题库', value: 2 },
  ]
  return (
    <MobilePageLayout>
      <Header level="1">创建宝藏</Header>
      <ContentBox>
        <Input maxlength="10" size="large" placeholder="宝藏名称(限10字)" />
        <FormHeader>
          <span></span>
          <Header level="4">题库选题</Header>
          <SubCovertControl>切换</SubCovertControl>
        </FormHeader>
        <Form labelSpan={3} labelAlign="left">
          <FormItem label="题目来源">
            <Select options={options} selected={selected} onSelected={setSelected} />
          </FormItem>
          <FormItem label="题目难度">
            <Select options={options} selected={selected} onSelected={setSelected} />
          </FormItem>
          <FormItem label="题目数量">
            <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={100} min={0} />
          </FormItem>
          <FormItem label="做题时间">
            <Select options={options} selected={selected} onSelected={setSelected} />
          </FormItem>
        </Form>
        <FormHeader>
          <span></span>
          <Header level="4">宝藏奖励</Header>
          <span></span>
        </FormHeader>

        <Form labelSpan={3} labelAlign="left">
          <FormItem label="总金额">
            <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={1000} min={0} />
          </FormItem>
          <FormItem label="要求正确率">
            <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={100} min={0} />
          </FormItem>
          <FormItem label="人数限制">
            <Input width="5em" fullwidth={false} value={topicCount} onChange={setTopicCount} type="number" max={100} min={0} />
          </FormItem>
        </Form>


        <Header level="4">公开范围</Header>
        <RadioList>
          <Radio>公开给所有棋友</Radio>
          <Radio>公开给测试用</Radio>
          <Radio>公开给指定班级学生</Radio>
          <SubRadois>
            <Checkbox>测试班级1</Checkbox>
            <Checkbox>测试班级2</Checkbox>
            <Checkbox>测试班级3</Checkbox>
          </SubRadois>
        </RadioList>
        <Header level="4">说明</Header>
        <Editor style={{marginBottom: '1em'}} />
        <div>
          <Checkbox>分享到101平台（手续费20%）</Checkbox>
        </div>
        <Center>
          <Button width='5em' onClick={onSubmit}>预览</Button>
        </Center>
      </ContentBox>
    </MobilePageLayout>
  )
}

export default CreateHunt
