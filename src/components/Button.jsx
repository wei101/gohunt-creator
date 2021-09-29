import styled from "styled-components"
import { fontSizeMaps } from "./forms/formsStyle"

const ButtonColor = {
  success: '#559e6e',
  primary: '#5e84cc',
  danger: '#db6933',
}

const BorderColor = {
  success: '#3f8456',
  primary: '#4873af',
  danger: '#b44816',
}

const StyBtn = styled.div`
  display: inline-flex;
  background-color: ${props => ButtonColor[props.color || 'primary']};
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
  align-items: center;
  box-shadow: 0 0.4em 0px ${props => BorderColor[props.color || 'primary']};
  cursor: pointer;
  justify-content: center;
  text-align: center;
  width: ${props => props.width || 'auto'};
  font-size: ${props => fontSizeMaps[props.size || 'medium']};
  transition: all .1s linear;

  &:active {
    box-shadow: none;
    transform: translateY(0.4em);
  }
`

const IconBtn = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.color || '#5e84cc'};
  border-radius: 100%;
  width: ${props => props.width || 'auto'};
  height: ${props => props.width || 'auto'};
`
function Button(props) {
  const { children, icon, size = "medium", color = "primary", width } = props

  if (icon) {
    return (
      <IconBtn width={width} {...props}>{icon}</IconBtn>
    )
  }

  return <StyBtn color={color} size={size} width={width} {...props}>{children}</StyBtn>
}

export default Button
