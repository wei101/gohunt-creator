import { useState } from "react"
import styled from "styled-components"
import StepBar from "../../components/StepBar"
import creatorBgImg from '../../images/creator-bg.jpg'
import CreateHunt from "./CreateHunt"
import Preview from "./Preview"

const CreatorBox = styled.div`
  background: url(${creatorBgImg});
  height: 100%;
  padding-top: 5em;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;

    .tmp {
      flex: 1;
    }

    .stepbar {
      flex: 3;
    }
  }

  .content {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    padding: 2em 0;

    > * {
      margin-right: 10px;
    }
  }
`

function Creator() {
  const [progress, setProgress] = useState(1)
  const [selected, onSelected] = useState(1)
  const [checked, onChecked] = useState(false)
  return (
    <CreatorBox>
      <div className="header">
        <div className="tmp"></div>
        <StepBar className="stepbar" count={3} current={progress} />
        <div className="tmp"></div>
      </div>
      <div className="content">
        <CreateHunt />
        <Preview />
      </div>
    </CreatorBox>
  )
}

export default Creator
