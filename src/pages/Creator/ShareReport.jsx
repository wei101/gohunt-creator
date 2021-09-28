import styled from "styled-components"
import { CardContentLayout, CardHeaderLayout, Center, Hongbao, HuntDetail, InfoFooterDiv, MsgBoxDiv } from "../../styles"
import { MobilePageLayout } from "./MobilePageLayout"
import HBImg from "../../images/wwb.png"
import Button from "../../components/Button"

const ShareReportLayout = styled(MobilePageLayout)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`

// const ReportLayout = styled.div`

// `

const ReportHeaderLayout = styled(CardHeaderLayout)`
  padding: 4rem 0rem 3rem 2rem;
`

const HuntTitle = styled.div`
  font-size: 1.4rem;
  color: white;
`

const HuntTips = styled.div`
  font-size: 0.9rem;
  color: white;
`

const ButtonCenter = styled(Center)`
  flex-direction: column;
  transform: translateY(-1em);

  .btn {
    margin-bottom: 1rem;
  }
`

export default function ShareReport({ onSubmit }) {
  return (
    <ShareReportLayout>
      <div>
        <ReportHeaderLayout>
          <HuntTitle>宝藏名称</HuntTitle>
          <HuntTips>本宝藏由101围棋亲手埋下</HuntTips>
        </ReportHeaderLayout>

        <CardContentLayout>
          <Hongbao>
            <img src={HBImg} alt="" />
            <span className="fee">100</span>
          </Hongbao>
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
        </CardContentLayout>
      </div>
      <ButtonCenter>
        <Button className="btn" color="#56a16e" width="10em">开始解题</Button>
        <Button width="10em" onClick={onSubmit}>分享宝藏</Button>
      </ButtonCenter>
    </ShareReportLayout>
  )
}
