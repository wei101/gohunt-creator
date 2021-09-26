import styled, { css } from "styled-components"
import { fontSizeMaps } from "./forms/formsStyle"

const StyBtn = styled.div`
  display: inline-flex;
  background-color: ${props => props.color || '#5e84cc'};
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
  align-items: center;
  box-shadow: 0 0.4em 0px #4873AF;
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
  display: inline-block;
  cursor: pointer;
  background-color: #f0df95;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
`
function Button(props) {
  const { children, icon, size="medium", color="#5e84cc", width, ...rest } = props

  if (icon) {
    return (
      <IconBtn {...props}>{icon}</IconBtn>
    )
  }

  return <StyBtn color={color} size={size} width={width} {...props}>{children}</StyBtn>
}

export default Button
