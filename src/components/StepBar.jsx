import styled, { css } from "styled-components";


const StepItemBox = styled.div`
  border-radius: 4rem;
  border: 2px solid #FBF8E9;
  line-height: 1.6;
  padding: 0 1rem;
  font-weight: bold;
  color: #FBF8E9;
  ${props => props.active &&
    css`
    color: #5E84CB;
    background-color: #FBF8E9;
  `};
`

const StepItem = ({ index, active }) => <StepItemBox active={active}>Step {index}</StepItemBox>

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

function StepBar(props) {
  const { count, current, className } = props
  const steps = []

  for (let i = 0; i < count; i++) {
    if (i !== 0 && i < count) {
      steps.push(<StepLine key={'l' + i} />)
    }
    steps.push(<StepItem key={i} index={i + 1} active={i === current} />)
  }

  return (
    <StepWrapper className={className}>
      {steps}
    </StepWrapper>
  )
}

export default StepBar;
