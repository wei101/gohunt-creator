import styled from "styled-components"
import Avatar from "../../components/Avatar"
import Button from "../../components/Button"
import HuntCard from "../../components/HuntCard"
import Icon from "../../components/Icon"
import BackBtnImg from "../../images/back-btn.png"
import HomeBgImg from "../../images/home-bg.jpg"

function Home() {

  const HomeWrapper = styled.div`
    background: url(${HomeBgImg});
  `

  const HuntCardGrid = styled.div`
    display: flex;
    width: 68.5rem;
    height: 26.81rem;
    overflow-x: hidden;
    overflow-y: overlay;
    margin: 0 auto;
    flex-wrap: wrap;
    
    & > div {
      margin-right: 1.5rem;
      margin-bottom: 1.5rem;

      &:last-child {
        margin-right: 0;
      }
    }
  `

  return <HomeWrapper>
    <h1>home</h1>
    <Avatar />
    <Button icon={<Icon src={BackBtnImg} />}></Button>
    <HuntCardGrid>
      <HuntCard />
      <HuntCard />
      <HuntCard />
      <HuntCard />
      <HuntCard />
      <HuntCard />
    </HuntCardGrid>
  </HomeWrapper>
}

export default Home
