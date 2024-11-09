import "./App.css";
import ApplyModal from "./components/modal/applicationModal";
import { useState } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "@emotion/styled";
function App() {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const isOpenModalFunc = () => {
    setIsOpenModal(true);
  };
  return (
    <S.Container>
      <S.Top>
        <div>상단</div>
      </S.Top>
      <S.Body>
        <S.BodyContent>메인(지도)asdsd</S.BodyContent>
      </S.Body>
      <S.BottomTab>
        <div onClick={isOpenModalFunc}>추가하기</div>
      </S.BottomTab>
      <ApplyModal
        description={"sdds"}
        title={"sdd"}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </S.Container>
  );
}

export default App;

const S = {
  Container: styled.div`
    max-width: 420px;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    border: black 1px solid;
  `,
  Top: styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-content: center;
    border-bottom: black 1px solid;
  `,
  Body: styled.div`
    width: 100%;
    height: 96vh;
    display: flex;
    justify-content: center;
    align-content: center;
  `,
  BodyContent: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
  `,
  BottomTab: styled.div`
    width: 420px;
    height: 50px;
    position: sticky;
    background: white;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border: black 1px solid;
  `,
};
