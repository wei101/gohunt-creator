import { useState } from "react"
import styled from "styled-components"
import Button from "../components/Button"
import Input from "../components/forms/Input"
import Select from "../components/forms/Select"
import StepBar from "../components/StepBar"
import creatorBgImg from '../images/creator-bg.jpg'
function Creator() {

  const CreatorBox = styled.div`
    background: url(${creatorBgImg});
    height: 100%;
    padding-top: 5em;

    .header {
      display: flex;

      .tmp {
        flex: 1;
      }

      .stepbar {
        flex: 3;
      }
    }
  `

  const [c, setC] = useState(1)
  const inc = () => setC(c + 1)

  return (
    <CreatorBox>
      <div className="header">
        <div className="tmp"></div>
        <StepBar className="stepbar" count={3} current={c} />
        <div className="tmp"></div>
      </div>
      <div className="content">
        <Input placeholder="宝藏名称(限10字内)" maxlength="10" />
        <Select options={[{label: 'hello', value: 1}, {label: 'hello', value: 3}, {label: 'hello', value: 2}]} />
      </div>
      <Button onClick={inc}>预览</Button>
    </CreatorBox>
  )
}

export default Creator
