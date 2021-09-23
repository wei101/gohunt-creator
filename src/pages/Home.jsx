import styled from "styled-components"
import HuntCard from "../components/HuntCard"
import Icon from "../components/Icon"
import BackBtnImg from "../images/back-btn.png"
import HomeBgImg from "../images/home-bg.jpg"
import Button from "../components/Button"
import { useHistory } from "react-router"

const HomeWrapper = styled.div`
  height: 100%;
  background: url(${HomeBgImg});
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const HuntCardGrid = styled.div`
  display: flex;
  width: 68.5rem;
  height: 25.81rem;
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
function Home() {
  
  const history = useHistory()

  return (
    <HomeWrapper>
      <HuntCardGrid>
        <HuntCard />
        <HuntCard />
        <HuntCard />
        <HuntCard />
        <HuntCard />
        <HuntCard />
      </HuntCardGrid>
      <Button onClick={() => history.push('/creator')}>创建宝藏<Icon src={BackBtnImg} /></Button>
    </HomeWrapper>
  )
}

export default Home
