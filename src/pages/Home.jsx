import styled from "styled-components"
import HuntCard from "../components/HuntCard"
import Icon from "../components/Icon"
import AddImg from "../images/add-timu.png"
import HomeBgImg from "../images/home-bg.jpg"
import Button from "../components/Button"
import { useHistory } from "react-router"
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { deleteOneBaby, getMyBaby } from "../apis"
import posImg from "../images/pos.png"
import Modal from "../components/Modal"
import { editBaby } from "../reducers/creator"
import { useDispatch } from "react-redux"
import { formatTime } from "../utils"

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
]

function Home() {

  const history = useHistory()
  const dispatch = useDispatch()
  const [treasures, setTreasures] = useState([])

  useEffect(() => {
    (async () => {

      const res = await getMyBaby()
      const treasures = res.data.babys.map(treasure => {
        return {
          ...treasure,
          date: formatTime(new Date(treasure.startt * 1000)),
          state: states[treasure.status]
        }
      })

      setTreasures(treasures)
    })()
  }, [])

  const deleteBabyById = async bid => {
    Modal.show('确认删除?').then(async () => {
      const res = await deleteOneBaby(bid)
      if (res.data.result !== 0) {
        return
      }
      const deleteBabyIndex = treasures.findIndex(t => t.id === bid)
      if (deleteBabyIndex > -1) {
        const newTreasures = [...treasures]
        newTreasures.splice(deleteBabyIndex, 1)
        setTreasures(newTreasures)
      }
    })
  }

  const editHunt = async bid => {
    dispatch(editBaby(bid)).then(result => {
      if (result === 0) {
        history.push('/creator')
      }
    })
  }

  return (
    <HomeWrapper>
      {
        treasures.length > 0
          ?
          (
            <HuntCardGrid>
              {treasures.map(t =>
                <HuntCard
                  onDelete={() => deleteBabyById(t.id)}
                  onEdit={() => editHunt(t.id)}
                  key={t.id}
                  data={t}
                />
              )}
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
