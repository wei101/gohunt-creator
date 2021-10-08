import { useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import styled from "styled-components"
import StepBar from "../../components/StepBar"
import creatorBgImg from '../../images/creator-bg.jpg'
import CreateHunt from "./CreateHunt"
import Preview from "./Preview"
import ShareReport from "./ShareReport"
import './index.css'
import { useParams } from "react-router-dom"

const CreatorBox = styled.div`
  background: url(${creatorBgImg});
  padding-top: 5em;
  display: flex;
  height: 0;
  flex: 1;
  flex-direction: column;

  .header {
    display: flex;
    flex: 0;

    .tmp {
      flex: 1;
    }

    .stepbar {
      flex: 3;
    }

    @media screen and (max-width: 576px) {
      .stepbar {
        flex: 10;
      }
    }
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding: 2em 0;
    height: 0;
    flex: 1;
    flex-wrap: nowrap;
  }
`

const pageKeys = [
  'creator',
  'preview',
  'report'
];

const comps = [CreateHunt, Preview, ShareReport]
function Creator() {
  const { bid } = useParams()
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(0)

  const onSubmit = () => {
    if (2 > progress) {
      setProgress(progress + 1)
      setShow(!show)
    }
  }

  
  const onBack= () => {
    if (-1 < progress) {
      setProgress(progress - 1)
      setShow(!show)
    }
  }

  const CurrentPage = comps[progress]
  return (
    <CreatorBox>
      <div className="header">
        <div className="tmp"></div>
        <StepBar className="stepbar" count={3} current={progress} />
        <div className="tmp"></div>
      </div>
      <div className="content">

        <SwitchTransition mode="out-in">
          <CSSTransition
            key={pageKeys[progress]}
            classNames="test"
            timeout={500}
          >
            <CurrentPage editBid={bid} onSubmit={onSubmit} onBack={onBack} />
          </CSSTransition>
        </SwitchTransition>
      </div>
    </CreatorBox >
  )
}

export default Creator
