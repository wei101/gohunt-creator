import styled from "styled-components"
import HuntCard from "../components/HuntCard"
import Icon from "../components/Icon"
import AddImg from "../images/add-timu.png"
import HomeBgImg from "../images/home-bg.jpg"
import Button from "../components/Button"
import { useHistory } from "react-router"
import { useEffect, useState } from "react"
import { getAllTreasure, getMyBaby, getMyBabys } from "../apis"

const HomeWrapper = styled.div`
  height: 100%;
  background: url(${HomeBgImg});
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const HuntCardGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  overflow-x: hidden;
  overflow-y: overlay;
  margin: 0 auto;
  flex-wrap: wrap;
  height: 100%;
  margin-top: 6em;
  margin-bottom: 2em;

  @media screen and (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    height: 25.81rem;
    margin-top: 0;
  }

  @media screen and (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }

  & > div {
    &:last-child {
      margin-right: 0;
    }
  }
`

const states = [
  'create',
  'open',
  'close'
];

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('/')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function Home() {

  const history = useHistory()
  const [treasures, setTreasures] = useState([])

  useEffect(() => {
    (async () => {
      
      const res = await getMyBabys()
      const treasures = res.data.packs.map(treasure => {
        return {
          ...treasure,
          date: formatTime(new Date(treasure.t)),
          state: states[treasure.status]
        }
      })

      setTreasures(treasures)
    })()
  }, [])

  return (
    <HomeWrapper>
      <HuntCardGrid>
        {treasures.map(t => <HuntCard key={t.id} data={t} />)}
      </HuntCardGrid>
      <Button onClick={() => history.push('/creator')}>创建宝藏<Icon size="small" src={AddImg} /></Button>
    </HomeWrapper>
  )
}

export default Home
