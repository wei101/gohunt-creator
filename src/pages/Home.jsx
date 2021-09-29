import styled from "styled-components"
import HuntCard from "../components/HuntCard"
import Icon from "../components/Icon"
import AddImg from "../images/add-timu.png"
import HomeBgImg from "../images/home-bg.jpg"
import Button from "../components/Button"
import { useHistory } from "react-router"
import { useEffect, useState } from "react"
import { getMyBaby } from "../apis"
import posImg from "../images/pos.png"
const HomeWrapper = styled.div`
  height: 100%;
  padding-bottom: 1rem;
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

const HuntPos = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  color: #9B8368;
  font-weight: bold;
  margin-bottom: 2rem;
`

const HuntPosImg = styled.img`
  width: 20rem;
  background-image: url(${posImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
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

      const res = await getMyBaby()
      const treasures = res.data.babys.map(treasure => {
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
      {
        treasures.length > 0
          ?
          (
            <HuntCardGrid>
              {treasures.map(t => <HuntCard key={t.id} data={t} />)}
            </HuntCardGrid>
          )
          :
          (
            <HuntPos>
              <HuntPosImg src={posImg} alt="" />
              <div>您还没有创建过宝藏哦~</div>
            </HuntPos>
          ) 
      }

      <Button onClick={() => history.push('/creator')}>创建宝藏<Icon size="small" src={AddImg} /></Button>
    </HomeWrapper>
  )
}

export default Home
