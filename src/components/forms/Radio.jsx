import styled from "styled-components"
import correctImg from "../../images/correct.png"

const LabelBox = styled.label`
  display: inline-flex;
  align-items: center;
  color: #603708;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.75em;
`

const CheckboxShow = styled.div`
  width: 1em;
  height: 1em;
  border: 3px solid #559e6e;
  border-radius: 100%;

  background-color: ${props => props.checked ? '#fbf8e9' : 'rgba(0, 0, 0, 0)'};
  margin-right: .5em;
  background-image: url(${props => props.checked ? correctImg : ''});
  background-size: cover;
`

const CheckboxElem = styled.input`
  display: none;
`

export default function Radio({ children, name, checked, onChecked = () => {} }) {
  return (
    <LabelBox>
      <CheckboxShow checked={checked} />
      <CheckboxElem type="checkbox" name={name} defaultChecked={checked} onChange={onChecked} />
      {children}
    </LabelBox>
  )
}
