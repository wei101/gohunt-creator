import { Children } from "react"
import styled from "styled-components"
import HomeBgImg from "../../images/home-bg.jpg"

const PageLayout = styled.div`
  width: 22em;
  height: 100%;
  background-image: url(${HomeBgImg});
  overflow-y: auto;
`

export function MobilePageLayout({children, ...rest}) {
  return (
    <PageLayout {...rest}>
      {children}
    </PageLayout>
  )
}
