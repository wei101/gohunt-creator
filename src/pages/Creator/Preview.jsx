import styled from "styled-components";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { Between } from "../../styles";
import { Center } from "../../styles";
import { MobilePageLayout } from "./MobilePageLayout";

const PreviewLayout = styled(MobilePageLayout)`
  display: flex;
  flex-direction: column;
`

const AddTopic = styled.span`
  color: #718ba3;
  font-size: 0.75em;
  font-weight: bold;
`

const Control = styled(Between)`
  padding: 0em 1em;
  flex: 0;
`
const GridBoxWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`

const GridBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex: 1;
`

const GridItem = styled.div`
  padding-bottom: 100%;
  height: 0;
  position: relative;
`

const GridItemContent = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 4px;
  border: 4px solid #e5b058;
`

const Footer = styled.div`
  flex: 0;
`

const FooterInfoBar = styled(Between)`
  background-color: #f1e8bb;
  font-size: 0.8em;
  color: #845e32;
  font-weight: bold;
  padding: 0.5em;

  & > span {
    text-align: center;
  }
`

const BtnCenter = styled(Center)`
  padding: 1em 0;
`

function Preview({
  onSubmit
}) {
  return (
    <PreviewLayout>
      <Header level="1">宝藏名</Header>
      <Control>
        <span></span>
        <AddTopic>添加题目</AddTopic>
      </Control>
      <GridBoxWrapper>
        <GridBox>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
          <GridItem><GridItemContent></GridItemContent></GridItem>
        </GridBox>
      </GridBoxWrapper>
      <Footer>
        <FooterInfoBar>
          <span>宝藏:100元</span>
          <span>正确率:100元</span>
          <span>限100人</span>
        </FooterInfoBar>
        <BtnCenter>
          <Button onClick={onSubmit}>生成宝藏</Button>
        </BtnCenter>
      </Footer>
    </PreviewLayout>
  )
}

export default Preview
