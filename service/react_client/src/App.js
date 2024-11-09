import "./App.css";
import ApplyModal from "./components/modal/applicationModal";
import { useState } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "@emotion/styled";
import { IoMdAddCircle } from "react-icons/io";
import MapRenderer from "./MapRenderer";

function App() {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const isOpenModalFunc = () => {
    setIsOpenModal(true);
  };

  return (
    <>
      <GlobalStyle />
      <S.Container>
        <S.Top>
          <S.HeaderText>상단</S.HeaderText>
        </S.Top>
        <S.Body>
          <S.BodyContent>
            <MapRenderer />
          </S.BodyContent>
        </S.Body>
        <S.BottomTab>
          <S.PlusIconContainer onClick={isOpenModalFunc}>
            <IoMdAddCircle size={80} color="#ff7a50" />
          </S.PlusIconContainer>
        </S.BottomTab>
        <ApplyModal
          description={"sdds"}
          title={"sdd"}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
        />
      </S.Container>
    </>
  );
}

const S = {
  Container: styled.div`
    max-width: 420px;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffecb3;
    border: 1px solid #ffc4a8;
    border-radius: 15px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  `,
  Top: styled.div`
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(90deg, #ff9e80, #ffc4a8);
    color: #ff7a50;
    font-weight: bold;
    font-size: 1.2em;
    border-bottom: 2px solid #ffe0cc;
  `,
  HeaderText: styled.div`
    color: #ff7a50;
  `,
  Body: styled.div`
    width: 100%;
    height: calc(100vh - 150px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffe0cc;
    border-top: 2px solid #ff9e80;
  `,
  BodyContent: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffe0cc;
  `,
  BottomTab: styled.div`
    width: 100%;
    height: 100px;
    background: linear-gradient(90deg, #ffe0cc, #ffecb3);
    position: sticky;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-top: 2px solid #ffc4a8;
  `,
  PlusIconContainer: styled.div`
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffecb3;
    border-radius: 50%;
    padding: 15px;
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: translateX(-50%) scale(1.1);
    }
  `,
};

export default App;
