import { createContext, useContext } from "react"
import styled from "styled-components"
import { fontSizeMaps } from "./formsStyle"

const LabelBox = styled.label`
  display: inline-flex;
  align-items: center;
  color: #603708;
  cursor: pointer;
  font-size: ${props => fontSizeMaps[props.size] || (props.size + 'rem')}
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

const RadioGroupContext = createContext()
// const RadioGroupContextProvider = RadioGroupContext.Provider

export function RadioGroup({
  name,
  onChange,
  value,
  children
}) {
  return (
    <RadioGroupContext.Provider value={{
      name,
      onChange: (value) => {
        onChange(value)
      },
      value,
    }}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export default function Radio(props) {
  const {
    size,
    children,
  } = props
  const context = useContext(RadioGroupContext)
  const name = context?.name || props?.name
  const checked = props?.value === context?.value
  const onChange = context?.onChange || props?.onChange || (() => {})
  
  return (
    <LabelBox size={size}>
      <RadioShow>
        {checked && <RadioInnerBox />}
        <CheckboxElem onChange={() => onChange(props.value)} name={name} type="radio" />
      </RadioShow>
      {children}
    </LabelBox>
  )
}
