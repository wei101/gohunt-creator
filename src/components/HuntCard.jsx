import styled from "styled-components"
import HBImg from "../images/wwb.png"

function HuntCard() {

  const HuntCardWrapper = styled.div`
    width: 15.5rem;
  `

  const Header = styled.div`
    background-color: #559e6e;
    border-bottom: 1.2rem solid #4b7e5c;
    box-sizing: border-box;
    padding: 0.5rem 1rem 1rem 1rem;
    font-size: 0.81rem;
    position: relative;

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
      color: white;
    }

    .flag {
      width: 5rem;
      padding: 0.1rem 0.5rem;
      border-radius: 100px;
      background-color: #55D68F;
      margin-left: 4px;
      color: white;
    }
    
  `

  const Content = styled.div`
    background-color: rgba(216, 184, 77, 0.3);
    box-sizing: border-box;
    padding: 0 1.4rem 1.2rem 1.4rem;

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
  `

  const InfoFooterDiv = styled.div`
    display: flex;
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

  return (
    <HuntCardWrapper>
      <Header>
        <h1 className="title">寻宝名称</h1>
        <div>
          <span className="white">99</span>人参与
          <span className="flag">进行中</span>
        </div>
        <div>2021/4/21创建</div>
      </Header>
      <Content>
        <div className="hongbao">
          <img src={HBImg} />
          <span className="fee">100</span>
        </div>
        <div className="total-fee">奖金100元</div>
        <MsgBoxDiv></MsgBoxDiv>
        <InfoFooterDiv>
          <HuntDetail>
            <li><span className="name-label">题目数量:</span><span className="value-label">10题</span></li>
            <li><span className="name-label">正确率需达到:</span><span className="value-label">100%</span></li>
            <li><span className="name-label">宝藏总数:</span><span className="value-label">100</span></li>
            <li><span className="name-label">目前剩余:</span><span className="value-label">10</span></li>
            <li><span className="name-label">分享范围:</span><span className="value-label">仅本教室学生可见</span></li>
          </HuntDetail>
          <span></span>
        </InfoFooterDiv>
      </Content>
    </HuntCardWrapper>
  )
}

export default HuntCard 