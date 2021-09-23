import styled from "styled-components"

const IconSpan = styled.span`
  display: inline-block;
  width: 2rem;
  height: 2rem;

  & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
`
function Icon({
  src
}) {
  
  return (
    <IconSpan>
      <img src={src} />
    </IconSpan>
  )
}

export default Icon
