import styled from "styled-components"
import yesImg from "../images/yes.png"
import { fontSizeMaps } from "./forms/formsStyle"
const LabelBox = styled.label`
  display: inline-flex;
  align-items: center;
  color: #603708;
  cursor: pointer;
  font-size: ${props => (fontSizeMaps[props.size] || props.size) + 'em'}
`

const CheckboxShow = styled.div`
  width: 1em;
  height: 1em;
  border: 3px solid #A39B6F;
  border-radius: 0.25em;
  background-color: ${props => props.checked ? '#559e6e' : '#fbf8e9'};
  border-color: ${props => props.checked ? '#559e6e' : '#A39B6F'};
  margin-right: .5em;
  background-image: url(${props => props.checked ? yesImg : ''});
  background-size: cover;
`

const CheckboxElem = styled.input`
  display: none;
`

function Checkbox({
  children,
  name,
  checked,
  size = 'medium',
  onChange = () => { }
}) {

  const handleChecked = e => {
    onChange(e.target.checked)
  }

  return (
    <LabelBox size={size}>
      <CheckboxShow checked={checked} />
      <CheckboxElem type="checkbox" name={name} defaultChecked={checked} onChange={handleChecked} />
      {children}
    </LabelBox>
  )
}

export default Checkbox
