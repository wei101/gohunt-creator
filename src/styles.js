import styled from "styled-components";

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Between = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CardHeaderLayout = styled.div`
    background-color: #559e6e;
    border-bottom: 1.2rem solid #4b7e5c;
    box-sizing: border-box;
    padding: 0.5rem 1rem 1rem 1rem;
    font-size: 0.81rem;
    position: relative;
    border-radius: 0.4em;

    .white {
        color: white;
    }

    .title {
        font-size: 1.1rem;
        margin: 0;
        color: white;
    }

    .flag {
        width: 5rem;
        padding: 0.1rem 0.5rem;
        border-radius: 100px;
        background-color: #55D68F;
        margin-left: 4px;
        color: white;
    }
`

export const CardContentLayout = styled.div`
  background-color: rgba(216, 184, 77, 0.3);
  box-sizing: border-box;
  padding: 0 1.4rem 1.2rem 1.4rem;

  .total-fee {
    font-size: 1rem;
    text-align: center;
    color: #e7610f;
    font-weight: bold;
    padding-bottom: 0.8rem;
  }
`

export const Hongbao = styled.div`
  width: 12rem;
  margin: auto;
  position: relative;
  margin-top: -3rem;

  img {
    width: 100%;
    object-fit: cover;
  }

  .fee {
    color: #e7610f;
    font-weight: bold;
    font-size: 1.2rem;
    width: 4rem;
    position: absolute;
    top: 3.8rem;
    left: 1.1rem;
    text-align: center;
  }
`

export const MsgBoxDiv = styled.div`
  border: #D9BF69 2px solid;
  border-radius: 12px;
  height: 8rem;
  margin-bottom: 1rem;
`
export const InfoFooterDiv = styled.div`
  display: flex;
`

export const HuntDetail = styled.ul`
  flex: 1;
  list-style: none;
  padding: 0;
  font-size: 1rem;
  margin: 0;

  li {
    line-height: 1.6;
  }

  .name-label {
    color: #8A6A45;
    margin-right: 4px;
  }

  .value-label {
    color: #603708;
    font-weight: bold;
  }
`