import { useState } from "react"
import styled from "styled-components"
import Icon from "../Icon"
import { fontSizeMaps } from "./formsStyle"
import selectArrowImg from "../../images/select-arrow.png"

const TreeSelectLayout = styled.div`
  border-radius: .5em;
  background-color: #f2e7bd;
  font-size: ${props => fontSizeMaps[props.size || 'large']};
  overflow: hidden;
`


const Content = styled.div`
  height: 8em;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1em;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  font-size: ${props => fontSizeMaps[props.size || 'large']};
`

const OpenBoxBtn = styled.div`
  line-height: 2.4;
  text-align: center;
  background-color: #ecbf75;
  color: #6e4608;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-left: 1em;
`

const SelectList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #6e4608;
  font-weight: bold;
`

const SelectItem = styled.div`
  line-height: 2;
  text-align: center;
  cursor: pointer;

  &:nth-child(odd) {
    background-color: #e7daaa;
  }
`

function Editor({
  style
}) {

  const [openBox, setOpenBox] = useState(false)
  const [editText, onEditChange] = useState('')
  const msgs = [
    'hello world!',
    'hello world!',
    'hello world!',
    'hello world!',
    'hello world!',
  ]
  const toggleOpenBox = () => setOpenBox(!openBox)
  const insertMsg = msg => {
    onEditChange(editText + msg)
    toggleOpenBox()
  }

  return (
    <TreeSelectLayout style={style}>
      <Content>
        {
          openBox
            ?
            <SelectList>
              {
                msgs.map((msg, index) => (
                  <SelectItem onClick={() => insertMsg(msg)} key={index}>{msg}</SelectItem>
                ))
              }
            </SelectList>
            :
            <TextArea onChange={e => {
              onEditChange(e.target.value)
            }}>{editText}</TextArea>
        }
      </Content>
      <OpenBoxBtn onClick={toggleOpenBox}>
        <span>说明文字列表</span>
        <Icon style={{
          transform: `rotate(${openBox ? '0' : '90deg'})`
        }} src={selectArrowImg} />
      </OpenBoxBtn>
    </TreeSelectLayout>
  )
}

export default Editor
