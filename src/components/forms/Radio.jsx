import styled from "styled-components"
import correctImg from "../../images/correct.png"
import Checkbox from "../Checkbox"
import { fontSizeMaps } from "./formsStyle"

const LabelBox = styled.label`
  display: inline-flex;
  align-items: center;
  color: #603708;
  cursor: pointer;
  font-size: ${props => (fontSizeMaps[props.size] || props.size) + 'em'}
`

const RadioShow = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 100%;
  border-width: 0.15em;
  border-style: solid;
  border-color: ${props => props.checked ? '#559e6e' : '#A39B6F'};
  margin-right: 0.25em;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const RadioInnerBox = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 100%;
  background-color: #559e6e;
`

const CheckboxElem = styled.input`
  display: none;
`

export default function Radio({
  checked,
  size,
  children,
  name,
  onChange = () => { }
}) {
  return (
    <LabelBox size={size}>
      <RadioShow checked={checked} onClick={() => onChange(!checked)}>
        {checked && <RadioInnerBox />}
      </RadioShow>
      <CheckboxElem name={name} type="radio" />
      {children}
    </LabelBox>
  )
}
