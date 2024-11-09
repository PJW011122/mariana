import "./App.css";
import ApplyModal from "./components/modal/applicationModal";
import { useEffect, useState } from "react";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "@emotion/styled";
import { IoMdAddCircle } from "react-icons/io";
import MapRenderer from "./MapRenderer";
import SignupModal from "./components/modal/SignupModal";
import LoginModal from "./components/modal/LoginModal";
import { Toaster } from "react-hot-toast"; // Make sure path is correct

function App() {
  const [isOpenMarkerModal, setIsOpenMarkerModal] = useState(false);
  const [isOpenSignupModal, setIsOpenSignupModal] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [plusButtonType, setPlusButtonType] = useState("");

  const isOpenModalFunc = () => {
    setIsOpenMarkerModal(true);
  };

  const isOpenModalFunc2 = () => {
    setIsOpenSignupModal(true);
  };

  const isOpenModalFunc3 = () => {
    setIsOpenLoginModal(true);
  };

  useEffect(() => {
    const isSignup = localStorage.getItem("isSignup");
    const userId = localStorage.getItem("userId");

    if (isSignup && !userId) setPlusButtonType("logIn");
    if (!isSignup) setPlusButtonType("signUp");
  }, []);

  const handlePlusButtonType = () => {
    if (plusButtonType === "signUp") return isOpenModalFunc2;
    if (plusButtonType === "logIn") return isOpenModalFunc3;
    return isOpenModalFunc;
  };

  return (
    <>
      <GlobalStyle />
      <S.Container>
        <Toaster />
        <S.Top>
          <div>상단</div>
        </S.Top>
        <S.Body>
          <S.BodyContent>
            <MapRenderer />
          </S.BodyContent>
        </S.Body>
        <S.BottomTab>
          <S.PlusIconContainer onClick={handlePlusButtonType()}>
            <IoMdAddCircle size={130} />
          </S.PlusIconContainer>
        </S.BottomTab>
        <ApplyModal
          isOpenModal={isOpenMarkerModal}
          setIsOpenModal={setIsOpenMarkerModal}
        />
        <SignupModal
          isOpenModal={isOpenSignupModal}
          setIsOpenModal={setIsOpenSignupModal}
        />
        <LoginModal
          isOpenModal={isOpenLoginModal}
          setIsOpenModal={setIsOpenLoginModal}
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
    background: white;
  `,
  Body: styled.div`
    width: 100%;
    height: 96vh;
    display: flex;
    justify-content: center;
    align-content: center;
    background: white;
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
    height: 100px;
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
  PlusIconContainer: styled.div`
    position: absolute;
    bottom: -12%;
    left: 35%;
  `,
};

export default App;
