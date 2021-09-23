import styled from "styled-components"
import { fontSizeMaps } from "./formsStyle";

const InputBox = styled.input`
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
`
function Input(props) {

  return (
    <InputBox {...props} />
  )
}

export default Input
