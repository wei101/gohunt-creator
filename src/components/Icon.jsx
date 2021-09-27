import styled from "styled-components"

const IconSpan = styled.span`
  display: inline-block;
  width: ${props => (IconSize[props.size] || props.size) +'em'};
  height: ${props => (IconSize[props.size] || props.size) + 'em'};

  & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
`

const IconSize = {
  'small': 1,
  'medium': 2,
  'large': 3,
}

function Icon({
  src,
  size = 'medium',
  style,
  onClick
}) {
  
  return (
    <IconSpan size={size} style={style} onClick={onClick}>
      <img src={src} />
    </IconSpan>
  )
}

export default Icon
