import { useHistory } from "react-router-dom"
import styled from "styled-components"
import Avatar from "../components/Avatar"
import Button from "../components/Button"
import Icon from "../components/Icon"
import BackBtnImg from "../images/back-btn.png"

const NavWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 2.27rem 2.63rem;
    padding-bottom: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
`

function Navigator() {

    const history = useHistory()
    console.log(history);
    const handleGoBack = () => location.hash === '#/' ? location.href = 'https://www.101weiqi.com/' : history.goBack()
    return (
        <NavWrapper>
            <Button onClick={handleGoBack} icon={<Icon src={BackBtnImg} />}></Button>
            <Avatar />
        </NavWrapper>
    )
}

export default Navigator
