import styled, { css } from "styled-components";
import { fontSizeMaps } from "./formsStyle";
import selectArrowImg from "../../images/select-arrow.png"
import { useState } from "react";

const SelectBox = styled.div`
  display: inline-block;
  font-size: ${props => fontSizeMaps[props.size || 'medium']};
  text-align: center;
  color: #694216;
  font-weight: bold;
  line-height: 2.5;
  height: 2.5em;
  cursor: pointer;
  
  .option {
    background-color: #f0e8ba;
  }
`

const TopicBox = styled.div`
  position: relative;
  width: 100%;
  padding: 0 2em 0 1em;
  box-sizing: border-box;
  border-radius: ${props => props.show ? '1px' : '2em'}
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
  const { onClick } = props
  return <TopicBox onClick={onClick}>hello</TopicBox>
}

function Select(props) {
  const { options } = props;
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  const optionElems = options.map(({ label, value }) => <div className="option" key={value} data-value={value}>{label}</div>)
  return (
    <SelectBox>
      <Topic show={show} onClick={toggle} />
      {
        show &&
        <>{optionElems}</>
      }
    </SelectBox>
  )
}

export default Select;
