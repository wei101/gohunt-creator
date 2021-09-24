import styled from "styled-components"

const fontSizeLevelMaps = {
    1: '2rem',
    2: '1.75rem',
    3: '1.5rem',
    4: '1.25rem',
    5: '1.1rem',
    6: '0.9rem',
}

const Title = styled.div`
    white-space: nowrap;
    color: #539e6c;
    text-align: center;
    font-weight: bold;
    line-height: 1.8;
    font-size: ${props => fontSizeLevelMaps[props.level]}
`
function Header({ level = 1, children, ...rest }) {
    return <Title level={level} {...rest}>{children}</Title>
}

export default Header
