import styled from "styled-components"
import HomeBgImg from "../../images/home-bg.jpg"

const PageLayout = styled.div`
  width: 22em;
  background-image: url(${HomeBgImg});
  margin: auto;
  height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: 24em;
  }

  @media screen and (max-width: 576px) {
    width: 90%;
  }
  
`

export function MobilePageLayout({children, ...rest}) {
  return (
    <PageLayout {...rest}>
      {children}
    </PageLayout>
  )
}
