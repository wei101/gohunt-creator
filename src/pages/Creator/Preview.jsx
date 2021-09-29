import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../../components/Button";
import Header from "../../components/Header";
import Icon from "../../components/Icon";
import { Between } from "../../styles";
import { Center } from "../../styles";
import { MobilePageLayout } from "./MobilePageLayout";
import redTrashIcon from "../../images/red-trash.png"
import { addTopicById, deleteTopicById } from "../../reducers/preview";
import { useDispatch } from "react-redux";
import Modal from "../../components/Modal";
import Input from "../../components/forms/Input";
import { doPay, pay } from "../../reducers/pay";
const QipanAPI = require('../../libs/qipan-web')
const PreviewLayout = styled(MobilePageLayout)`
  display: flex;
  flex-direction: column;
`

const AddTopic = styled.span`
  color: ${props => props.disabled ? '#ccc' :'#718ba3'};
  font-size: 0.75em;
  font-weight: bold;
  cursor: pointer;
`

const Control = styled(Between)`
  padding: 0em 1em;
  flex: 0;
`
const GridBoxWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`

const GridBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex: 1;
`

const GridItemWrapper = styled.div`
  margin: 4px;
  color: #765228;
  font-weight: bold;
`

const GridItemNavbar = styled.div`
  display: flex;
  justify-content: space-between;
`

const GridItem = styled.div`
  padding-bottom: 100%;
  height: 0;
  position: relative;
`

const GridItemContent = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 4px solid #e5b058;
`

const Footer = styled.div`
  flex: 0;
`

const FooterInfoBar = styled(Between)`
  background-color: #f1e8bb;
  font-size: 0.8em;
  color: #845e32;
  font-weight: bold;
  padding: 0.5em;

  & > span {
    text-align: center;
  }
`

const InputTopicBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0 3rem;
`

const TopicQN = styled.div`

`

const BtnCenter = styled(Center)`
  padding: 1em 0;
`

function Preview({
  onSubmit
}) {
  const { creator, preview, pay } = useSelector(state => state)
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputTopic, setInputTopic] = useState('')
  const [showTip, setShowTip] = useState(false)
  const closeTipModal = () => setShowTip(false)
  const { bid, fee, correctPrecent, personCount, topicCount } = creator
  const { topics } = preview
  const payDone = pay.payDone
  const isTopicFull = topics.length >= topicCount

  const renderQipan = (el, topic) => {
    if (el) {
      QipanAPI.buildTimuThumbnail(el, topic)
    }
  }

  const deleteTopic = topicId => dispatch(deleteTopicById(topicId, bid))
  const showAddTopicModal = () => {
    if (!isTopicFull) {
      setModalVisible(true)
    } else {
      setShowTip(true)
    }
  }

  const addTopic = () => {
    dispatch(addTopicById(inputTopic, bid))
    setModalVisible(false)
    setInputTopic('')
  }

  const handleSubmit = async () => {
    if (topics.length === 0) {
      Modal.show('题目不得为空!', [{
        label: '确认',
        callback: close => close()
      }])
      return
    }

    dispatch(doPay(bid, payDone => {
      if (payDone) {
        onSubmit()
      }
    }))
  }

  return (
    <PreviewLayout>
      <Modal actions={[
        {
          label: '确定',
          callback: addTopic
        }
      ]} visible={modalVisible} onClose={() => setModalVisible(false)}>
        <InputTopicBox>
          <span>Q-</span>
          <Input value={inputTopic} onChange={setInputTopic} type="number" min={1} max={999999} width="10rem" />
        </InputTopicBox>
      </Modal>
      <Header level="1">宝藏名</Header>
      <Control>
        <span></span>
        <AddTopic disabled={isTopicFull} onClick={showAddTopicModal}>添加题目</AddTopic>
      </Control>
      <GridBoxWrapper>
        <GridBox>
          {
            topics.map(topic => {
              return (
                <GridItemWrapper key={topic.qid}>
                  <GridItem>
                    <GridItemContent ref={el => renderQipan(el, topic)}>
                    </GridItemContent>
                  </GridItem>
                  <GridItemNavbar>
                    <span>Q-{topic.qid}</span>
                    <Icon size={1.25} src={redTrashIcon} onClick={() => deleteTopic(topic.qid)} />
                  </GridItemNavbar>
                </GridItemWrapper>
              )
            })
          }
        </GridBox>
      </GridBoxWrapper>
      <Footer>
        <FooterInfoBar>
          <span>宝藏:{fee}元</span>
          <span>正确率:{correctPrecent}%</span>
          <span>限{personCount}人</span>
        </FooterInfoBar>
        <BtnCenter>
          <Button onClick={handleSubmit}>生成宝藏</Button>
        </BtnCenter>
      </Footer>
      <Modal visible={showTip} onClose={closeTipModal} actions={[
        {
          label: '确认',
          callback: closeTipModal
        }
      ]}>
        题目数量已满
      </Modal>
    </PreviewLayout>
  )
}

export default Preview
