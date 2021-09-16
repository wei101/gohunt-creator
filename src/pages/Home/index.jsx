import styled from "styled-components"
import Avatar from "../../components/Avatar"
import Button from "../../components/Button"
import Icon from "../../components/Icon"
import BackBtnImg from "../../images/back-btn.png"
import HomeBgImg from "../../images/home-bg.jpg"

function Home() {

  const HomeWrapper = styled.div`
    background: url(${HomeBgImg});
  `
  return <HomeWrapper>
    <h1>home</h1>
    <Avatar />
    <Button icon={<Icon src={BackBtnImg} />}></Button>
  </HomeWrapper>
}

export default Home
