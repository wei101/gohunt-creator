import { useState } from "react";
import styled from "styled-components"
import { fontSizeMaps } from "./formsStyle";

const InputBox = styled.input`
  width: ${props => {

    if (props.fullwidth) {
      return '100%'
    }

    if (props.width) {
      return props.width
    }

    return 'auto'
  }};
  font-size: ${props => fontSizeMaps[props.size || 'medium']};
  border-radius: 2em;
  outline: none;
  border: none;
  background-color: #f0e8ba;
  padding: 0em 1em;
  text-align: center;
  color: #694216;
  font-weight: bold;
  line-height: 2.5;

  &::placeholder {
    color:#cec17e; 
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
  }

`
function Input({
  value,
  onChange = () => { },
  fullwidth = true,
  width,
  max = Number.MAX_VALUE,
  min = Number.MIN_VALUE,
  type = 'text',
  maxlength = Number.MAX_VALUE,
  ...props
}) {
  const [oldValue, setOldValue] = useState(null)

  const handleChange = e => {
    e.preventDefault()

    let newValue = e.target.value
    if (type === 'text') {
      setOldValue(value)
      onChange(newValue)
    } else if (type === 'number') {
      const nvalue = Number(newValue)
      if ((nvalue <= max && nvalue >= min) || newValue === '') {
        setOldValue(value)
        onChange(newValue)
      }
    }
  }

  const onBlur = () => {
    if (type === 'number' && value === '') {
      onChange(oldValue)
    }
  }

  return (
    <InputBox
      onBlur={onBlur}
      width={width}
      fullwidth={fullwidth}
      value={value}
      onChange={handleChange}
      maxLength={maxlength}
      type={type}
      {...props}
    />
  )
}

export default Input
