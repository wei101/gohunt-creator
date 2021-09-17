import styled, { css } from "styled-components"

function Button(props) {
    const { children, icon } = props
    const StyBtn = styled.div`
        display: inline-block;
        cursor: pointer;
        ${props => props.icon && css`
            background-color: #f0df95;
            border-radius: 100%;
        `}
    `

    return (
        <StyBtn>{children}{icon}</StyBtn>
    )
}

export default Button
