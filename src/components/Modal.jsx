import ReactDOM from "react-dom"
import styled from "styled-components"
import closeImg from "../images/close.png"
import { Center } from "../styles"
import Button from "./Button"

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

const ModalDiv = styled.div`

`

const ModalContent = styled.div`
  padding: 2rem 1rem;
  background-color: #FFF7DC;
  border-radius: 0.5rem;
  box-shadow: 0 1rem 0 #BEAF79;
  margin-bottom: 2rem;
  min-width: 120px;
  position: relative;
`

const CloseBtn = styled.div`
  background-image: url(${closeImg});
  width: 2em;
  height: 2em;
  background-size: cover;
  position: absolute;
  right: 0;
  top: -1em;
  cursor: pointer;
`

const ModalButtons = styled.div`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
`

function Modal({
  onClose = () => { },
  visible = false,
  children,
  actions = [],
  showClose = true,
}) {

  if (!visible) {
    return null
  }

  return (
    <ModalWrapper>
      <ModalDiv>
        <ModalContent>
          {showClose && <CloseBtn onClick={onClose} />}
          {children}
        </ModalContent>
        <ModalButtons>
          {actions.map((action, i) => <Button key={i} style={{ marginBottom: 12 }} {...action.props} onClick={action.callback}>{action.label}</Button>)}
        </ModalButtons>
      </ModalDiv>
    </ModalWrapper>
  )
}


const show = (message, actions = [], onClose, ...rest) => {
  const container = document.getElementById('root')
  const cv = document.createElement("div")
  container.appendChild(cv)
  const removeElem = () => {
    onClose && onClose()
    ReactDOM.unmountComponentAtNode(cv)
    container.removeChild(cv)
  }
  const withCloseActions = actions.map(action => ({ ...action, callback: () => action.callback(removeElem) }))

  ReactDOM.render(<Modal visible={true} onClose={removeElem} actions={withCloseActions} {...rest}>
    <Center>
      {message}
    </Center>
  </Modal>, cv)

}

Modal.show = show
export default Modal
