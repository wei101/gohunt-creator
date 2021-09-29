import styled from "styled-components"
import DefaultAvatarImg from '../images/default-avatar.png'

const AvatarBox = styled.div`
  position: relative;
  width: 10rem;
`

const Info = styled.div`
  background-color: #fae397;
  border-color: #603708;
  width: 100%;
  border-radius: 100px;
  border: 4px solid #603708;
  box-sizing: border-box;
  font-size: 0.75rem;
  padding: 0.1rem 3.5rem 0.1rem 0;
  display: flex;
  flex-direction: column;

  & > * {
    text-align: right;
  }
`

const NameSpan = styled.span`
  color: #9f7e43;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: 2.5;
`

const AvatarImgWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background-color: #fae397;
  border-radius: 100%;
  box-sizing: border-box;
  border: 4px solid #603708;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 0;
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
function Avatar() {


  return (
    <AvatarBox>
      <Info>
        <NameSpan>Miiiia</NameSpan>
      </Info>
      <AvatarImgWrapper>
        <AvatarImg src={DefaultAvatarImg} />
      </AvatarImgWrapper>
    </AvatarBox>)
}

export default Avatar
