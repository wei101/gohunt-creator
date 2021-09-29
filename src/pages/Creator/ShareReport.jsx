import styled from "styled-components"
import { CardContentLayout, CardHeaderLayout, Center, Hongbao, HuntDetail, InfoFooterDiv, MsgBoxDiv } from "../../styles"
import { MobilePageLayout } from "./MobilePageLayout"
import HBImg from "../../images/wwb.png"
import Button from "../../components/Button"
import { useSelector } from "react-redux"
import { HuntRangeType } from "../../types"
import Modal from "../../components/Modal"
import { useEffect, useState } from "react"
import { genBabyCode } from "../../apis"

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

const QrCodeImg = styled.img`
  width: 15em;
`

export default function ShareReport({ onSubmit }) {

  const creator = useSelector(state => state.creator)
  const restcount = Math.max(creator.personCount - creator.wincount, 0)

  const [imgUrl, setImgUrl] = useState('')
  const [showQrCodeModal, setShowQrCodeModal] = useState(false)
  const closeQrCodeModal = () => setShowQrCodeModal(false)

  useEffect(() => {
    (async () => {
      const res = await genBabyCode(creator.bid)
      if (res.data.result == 0) {
        setImgUrl(res.data.qrcode)
      }
    })()
  }, [])

  return (
    <ShareReportLayout>
      <div>
        <ReportHeaderLayout>
          <HuntTitle>{creator.title}</HuntTitle>
          <HuntTips>本宝藏由{creator.username}亲手埋下</HuntTips>
        </ReportHeaderLayout>

        <CardContentLayout>
          <Hongbao>
            <img src={HBImg} alt="" />
            <span className="fee">{creator.fee}</span>
          </Hongbao>
          <div className="total-fee">奖金{creator.fee}元</div>
          <MsgBoxDiv></MsgBoxDiv>
          <InfoFooterDiv>
            <HuntDetail>
              <li><span className="name-label">题目数量:</span><span className="value-label">{creator.topicCount}题</span></li>
              <li><span className="name-label">正确率需达到:</span><span className="value-label">{creator.correctPrecent}%</span></li>
              <li><span className="name-label">宝藏总数:</span><span className="value-label">{creator.personCount}</span></li>
              <li><span className="name-label">目前剩余:</span><span className="value-label">{restcount}</span></li>
              <li><span className="name-label">分享范围:</span><span className="value-label">{HuntRangeType[creator.openState]}</span></li>
            </HuntDetail>
            <span></span>
          </InfoFooterDiv>
        </CardContentLayout>
      </div>
      <ButtonCenter>
        <Button width="10em" onClick={() => setShowQrCodeModal(true)}>分享宝藏</Button>
      </ButtonCenter>
      <Modal visible={showQrCodeModal} onClose={closeQrCodeModal}>
        <QrCodeImg alt="" src={imgUrl} />
      </Modal>
    </ShareReportLayout>
  )
}
