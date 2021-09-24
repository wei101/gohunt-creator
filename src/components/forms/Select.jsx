import styled, { css } from "styled-components";
import { fontSizeMaps } from "./formsStyle";
import selectArrowImg from "../../images/select-arrow.png"
import { useState } from "react";

const SelectBox = styled.div`
  display: block;
  font-size: ${props => fontSizeMaps[props.size || 'medium']};
  text-align: center;
  color: #694216;
  font-weight: bold;
  line-height: 2.5;
  height: 2.5em;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 10;
  
  .option {
    background-color: #f0e8ba;
    z-index: 10;

    &:last-child {
      border-radius: 0 0 1.5em 1.5em;
    }
  }
`

const TopicBox = styled.div`
  position: relative;
  width: 100%;
  padding: 0 3em 0 2em;
  box-sizing: border-box;
  border-radius: ${props => props.show ? '1.5em 1.5em 0 0' : '1.5em'};
  background-color: #f0e8ba;

  &::after {
    display: block;
    content: ' ';
    position: absolute;
    right: 0.4em;
    top: 0;
    bottom: 0;
    background: url(${selectArrowImg});
    background-size: cover;
    margin: auto;
    width: 1.2em;
    height: 1.2em;
    transform: rotate(-90deg);
    transitoin: transform .4s linear;
    z-index: 9;
  }
`

function Topic(props) {
  const { onClick, show, children } = props
  console.log(show);


  return <TopicBox show={show} onClick={onClick}>{children}</TopicBox>
}

function Select(props) {
  const { options, selected, onSelected } = props;
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  let currentOptionIndex = options.findIndex(o => o.value === selected);
  currentOptionIndex = currentOptionIndex == -1 ? 0 : currentOptionIndex;
  const restOption = [...options]
  restOption.splice(currentOptionIndex, 1)
  const currentOption = options[currentOptionIndex]

  const optionElems = restOption.map(option => <div onClick={e => onSelected(option.value)} className="option" key={option.value}>{option.label}</div>)


  return (
    <SelectBox>
      <Topic show={show} onClick={toggle}>{currentOption.label}</Topic>
      {
        show &&
        <>{optionElems}</>
      }
    </SelectBox>
  )
}

export default Select;
