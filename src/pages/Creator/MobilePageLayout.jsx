import { Children } from "react"
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
`

export function MobilePageLayout({children, ...rest}) {
  return (
    <PageLayout {...rest}>
      {children}
    </PageLayout>
  )
}
