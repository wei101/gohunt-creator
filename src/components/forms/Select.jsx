import styled, { css } from "styled-components";
import { fontSizeMaps } from "./formsStyle";
import selectArrowImg from "../../images/select-arrow.png"
import { useEffect, useRef, useState } from "react";

const SelectBox = styled.div`
  display: block;
  white-space: nowrap;
  text-overflow: ellipse;
  font-size: ${props => fontSizeMaps[props.size || 'medium']};
  font-size: ${props => props.inline ? '0.75rem' : 'inherit'};
  text-align: center;
  color: #694216;
  font-weight: bold;
  line-height: 2.5;
  height: 2.5em;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
`

const Options = styled.div`
  z-index: 999;
  position: absolute;
  width: 100%;
  z-index: 9;
  max-height: ${props => props.inline ? '4em' : '15em'};
  overflow-y: auto;
  border-radius: ${props => props.inline ? '0 0 1em 1em' : '0 0 1.5em 1.5em'};
`

const Option = styled.div`
  background-color: ${props => props.active ? '#ffbb00' : '#f0e8ba'};
  z-index: 10;
  line-height: ${props => props.inline ? '1.4' : '2.5'};

  &:nth-child(odd) {
    background-color: ${props => props.active ? '#ffbb00' : '#e8dfa8'};
  }
`

const TopicBox = styled.div`
  position: relative;
  width: 100%;
  padding: 0 2em 0 2em;
  box-sizing: border-box;
  border-radius: ${props => props.show ? '1.5em 1.5em 0 0' : '1.5em'};
  background-color: #f0e8ba;
  height: 2.5em;

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
    transform: ${props => props.show ? 'rotate(-180deg)' : 'rotate(-90deg)'};
    transition: transform .1s linear;
  }

  ${props => props.inline && css`
    padding: 0 1em 0.2em 0 ;
    width: auto;
    border-radius: ${props => props.show ? '1em 1em 0 0' : '1em'};
    
    &::after {
      width: 1em;
      height: 1em;
    }
  `}
`
const NullOption = { label: ' ', value: Number.MAX_VALUE }

function Topic(props) {
  const { onClick, show, children, inline } = props
  return <TopicBox inline={inline} show={show} onClick={onClick}>{children}</TopicBox>
}

function Select(props) {
  const { options = [], selected, onSelected = () => {}, inline = false } = props
  const [show, setShow] = useState(false)
  const toggle = () => setShow(!show)

  const selectRef = useRef(null)

  let currentOption = options.find(o => o.value === selected)
  if (!currentOption) {
    currentOption = NullOption;
  }

  useEffect(() => {

    const handleOutClick = e => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setShow(false)
      }
    }

    document.addEventListener('click', handleOutClick)

    return () => {
      document.removeEventListener('click', handleOutClick)
    }
  }, [])

  const handleSelected = (option) => {
    onSelected(option.value, option)
    setShow(false)
  }

  const optionElems = options.map(option => {
    return <Option
      inline={inline}
      onClick={() => handleSelected(option)}
      active={currentOption.value === option.value}
      key={option.label}
    >
      {option.label}
    </Option>
  })


  return (
    <SelectBox inline={inline} ref={selectRef}>
      <Topic inline={inline} show={show} onClick={toggle}>{currentOption.label}</Topic>
      {
        show &&
        <Options inline={inline}>{optionElems}</Options>
      }
    </SelectBox>
  )
}

export default Select;
