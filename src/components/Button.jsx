import styled, { css } from "styled-components"

const StyBtn = styled.div`
  display: inline-flex;
  background: #5e84cc;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
  align-items: center;
  box-shadow: 0 0.4em 0px #4873AF;
  cursor: pointer;
  justify-content: center;
  text-align: center;
  width: ${props => props.width || 'auto'};
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
  const { children, icon, width, ...rest } = props

  if (icon) {
    return (
      <IconBtn {...props}>{icon}</IconBtn>
    )
  }

  return <StyBtn width={width} {...props}>{children}</StyBtn>
}

export default Button
