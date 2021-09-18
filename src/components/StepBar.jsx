import styled, { css } from "styled-components";


function StepItem(props) {

  const { index, active } = props

  const StepItem = styled.div`
    border-radius: 4rem;
    border: 2px solid #FBF8E9;
    line-height: 1.6;
    padding: 0 1rem;
    font-weight: bold;
    color: #FBF8E9;
    ${() => active &&
      css`
      color: #5E84CB;
      background-color: #FBF8E9;
    `};
  `

  return <StepItem>Step {index}</StepItem>
}

function StepBar(props) {
  const { count, current } = props

  const StepWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
  `

  const StepLine = styled.div`
    flex: 1;
    border-top: 1px solid #FBF8E9;
    height: 0;
    margin-top: 1rem;
  `

  const steps = []

  for (let i = 1; i <= count; i++) {
    if (i !== 1 && i <= count) {
      steps.push(<StepLine />)
    }
    steps.push(<StepItem index={i} active={i === current} />)
  }

  return <StepWrapper>
    {steps}
  </StepWrapper>
}

export default StepBar;
