import styled from "styled-components"
import HBImg from "../images/wwb.png"
import trashIcon from "../images/trash_icon.png"
import editIcon from "../images/edit_icon.png"
import Icon from "./Icon"
import Button from "./Button"
import { HuntCardRangeType, StateTipMaps, StateTipSpanMaps } from "../types"
import { formatTime } from "../utils"

const HuntCardWrapper = styled.div`
  width: 15.5rem;
  margin: 0 auto;
`
const Header = styled.div`
  background-color: #559e6e;
  border-bottom: 1.2rem solid #4b7e5c;
  box-sizing: border-box;
  padding: 0.5rem 1rem 1rem 1rem;
  font-size: 0.81rem;
  position: relative;
  border-radius: 0.4em 0.4em 0 0;

  & > div {
    color: #ADE8C2;
    margin: 0.27rem 0;
  }

  .white {
    color: white;
  }

  .title {
    font-size: 1.1rem;
    margin: 0;
    height: 1em;
    color: white;
  }

  .flag {
    width: 5rem;
    padding: 0.1rem 0.5rem;
    border-radius: 100px;
    margin-left: 4px;
  }
`

const Commands = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;

  &>div:first-child {
    margin-right: 0.4rem;
  }
`

const Content = styled.div`
  background-color: rgba(216, 184, 77, 0.3);
  box-sizing: border-box;
  padding: 0 1.4rem 1.2rem 1.4rem;
  border-radius: 0 0 0.4em 0.4em;

  .hongbao {
    width: 7.2rem;
    margin: auto;
    position: relative;
    margin-top: -2rem;
    
    img {
      width: 100%;
      object-fit: cover;
    }

    .fee {
      color: #e7610f;
      font-weight: bold;
      font-size: 1.2rem;
      width: 2.5rem;
      position: absolute;
      top: 1.8rem;
      left: 0.6rem;
      text-align: center;
    }
  }

  .total-fee {
    font-size: 1rem;
    text-align: center;
    color: #e7610f;
    font-weight: bold;
    padding-bottom: 0.8rem;
  }
`

const MsgBoxDiv = styled.div`
  border: #D9BF69 2px solid;
  border-radius: 12px;
  height: 4rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #948552;
  overflow: hidden;
`

const InfoFooterDiv = styled.div`
  display: flex;
  position: relative;
`

const HuntDetail = styled.ul`
  flex: 1;
  list-style: none;
  padding: 0;
  font-size: 0.8rem;
  margin: 0;

  li {
    line-height: 1.6;
  }

  .name-label {
    color: #8A6A45;
    margin-right: 4px;
  }

  .value-label {
    color: #603708;
    font-weight: bold;
  }
`

const QrCodeImg = styled.img`
  position: absolute;
  bottom: 0em;
  right: -1em;
  width: 5em;
  height: 5em;
  background-color: white;
  border-radius: 100%;
  cursor: pointer;
`

function HuntCard({
  data,
  onDelete = () => { },
  onEdit = () => { },
  onPreview = () => { },
}) {
  let { name, usercount, fee, date, docount, okper, qnumber, desc, status, startt, qcrimgpath, sharetype, wincount } = data
  status = 1
  const Status = StateTipSpanMaps[status]
  const restcount = Math.max(usercount - wincount, 0)

  return (
    <HuntCardWrapper>
      <Header>
        <h1 className="title">{name}</h1>
        <div>
          <span className="white">{docount}</span>人参与
          <Status className="flag">{status == 0 ? formatTime(new Date(startt * 1000)) + '正式开始' : StateTipMaps[status]}</Status>
        </div>
        <div>{date}创建</div>
        <Commands>
          <Button onClick={onDelete} width='1.5rem' color="primary" icon={<Icon size={1.1} src={trashIcon} />} />
          <Button onClick={onEdit} width='1.5rem' color="primary" icon={<Icon size={1.1} src={editIcon} />} />
        </Commands>
      </Header>
      <Content>
        <div className="hongbao">
          <img src={HBImg} alt="" />
          <span className="fee">{fee}</span>
        </div>
        <div className="total-fee">奖金{fee}元</div>
        <MsgBoxDiv>{desc}</MsgBoxDiv>
        <InfoFooterDiv>
          <HuntDetail>
            <li><span className="name-label">题目数量:</span><span className="value-label">{qnumber}题</span></li>
            <li><span className="name-label">正确率需达到:</span><span className="value-label">{okper}%</span></li>
            <li><span className="name-label">宝藏总数:</span><span className="value-label">{usercount}</span></li>
            <li><span className="name-label">目前剩余:</span><span className="value-label">{restcount}</span></li>
            <li><span className="name-label">分享范围:</span><span className="value-label">{HuntCardRangeType[sharetype]}</span></li>
          </HuntDetail>
          <span></span>
          {qcrimgpath && <QrCodeImg onClick={onPreview} alt="" src={qcrimgpath} />}
        </InfoFooterDiv>
      </Content>
    </HuntCardWrapper>
  )
}

export default HuntCard