import "./App.css";
import ApplyModal from "./components/modal/applicationModal";
import { useState } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "@emotion/styled";
import MapRenderer from "./MapRenderer";  // Make sure path is correct

function App() {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const isOpenModalFunc = () => {
    setIsOpenModal(true);
  };
  return (
    <Container>
      <Top>
        <div>상단</div>
      </Top>
      <Body>
        <BodyContent>
          <MapRenderer />
        </BodyContent>
      </Body>
      <BottomTab>
        <div onClick={isOpenModalFunc}>추가하기</div>
      </BottomTab>
      <ApplyModal
        description={"sdds"}
        title={"sdd"}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </Container>
  );
}

const Container = styled.div`
  max-width: 420px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  border: black 1px solid;
`;

const Top = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-content: center;
  border-bottom: black 1px solid;
`;

const Body = styled.div`
  width: 100%;
  height: 96vh;
  display: flex;
  justify-content: center;
  align-content: center;
  overflow: hidden;
`;

const BodyContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const BottomTab = styled.div`
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
`;

export default App;