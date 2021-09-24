import styled, { ThemeProvider } from "styled-components"

const FormLayout = styled.div`
    display: flex;
    flex-direction: column;
`

const FormItemBox = styled.div`
    display: flex;
    margin-bottom: 0.5em;
    align-items: center;
`

const FormItemLabel = styled.div`
  flex: ${props => props.theme.labelSpan};
  overflow: hidden;
  margin-right: 0.5em;
  color: #603708;
  font-weight: bold;
  text-align: ${props => props.theme.labelAlign};
  font-size: 0.85em;
`

const FormItemContent = styled.div`
  flex: ${props => 12 - props.theme.labelSpan}
`

function Form({ children, labelSpan = 6, labelAlign = 'right' }) {

  const theme = {
    labelSpan,
    labelAlign
  }

  return (
    <ThemeProvider theme={theme}>
      <FormLayout>
        {children}
      </FormLayout>
    </ThemeProvider>
  )
}

export function FormItem({ label, children }) {

  return (
    <FormItemBox>
      <FormItemLabel>{label}</FormItemLabel>
      <FormItemContent>{children}</FormItemContent>
    </FormItemBox>
  )
}

export default Form
