import React, { useEffect, useState } from "react";
import "./App.css";
import ApplyModal from "./components/modal/applicationModal";
import GlobalStyle from "./styles/GlobalStyle";
import styled from "@emotion/styled";
import { IoMdAddCircle } from "react-icons/io";
import { FaUser, FaPlus } from "react-icons/fa6";
import MapRenderer from "./MapRenderer";
import SignupModal from "./components/modal/SignupModal";
import LoginModal from "./components/modal/LoginModal";
import MyPageModal from "./components/modal/MyPageModal";
import { Toaster } from "react-hot-toast";
import { typographies } from "./styles/typhographies";
import { colors } from "./styles/colors";

function App() {
  const [isOpenMarkerModal, setIsOpenMarkerModal] = useState(false);
  const [isOpenSignupModal, setIsOpenSignupModal] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenMyPageModal, setIsOpenMyPageModal] = useState(false);
  const [plusButtonType, setPlusButtonType] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Functions to open each modal
  const isOpenModalFunc = () => setIsOpenMarkerModal(true);
  const isOpenModalFunc2 = () => setIsOpenSignupModal(true);
  const isOpenModalFunc3 = () => setIsOpenLoginModal(true);

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

  // Handle marker click to open ApplyModal
  const handleMarkerClick = (postId) => {
    setSelectedPostId(postId);
    setIsOpenMarkerModal(true);
  };

  return (
    <>
      <GlobalStyle />
      <S.Container>
        <S.Body>
          <MapRenderer onMarkerClick={handleMarkerClick} />
        </S.Body>
        <S.BottomTab>
          <S.PlusIconContainer onClick={handlePlusButtonType()}>
            <FaPlus size={47} />
          </S.PlusIconContainer>
          <S.MyIconContainer onClick={() => setIsOpenMyPageModal(true)}>
            <FaUser size={47} />
          </S.MyIconContainer>
        </S.BottomTab>
        <ApplyModal
          isOpenModal={isOpenMarkerModal}
          setIsOpenModal={setIsOpenMarkerModal}
          postId={selectedPostId}
        />
        <SignupModal
          isOpenModal={isOpenSignupModal}
          setIsOpenModal={setIsOpenSignupModal}
        />
        <LoginModal
          isOpenModal={isOpenLoginModal}
          setIsOpenModal={setIsOpenLoginModal}
        />
        <MyPageModal
          isOpenModal={isOpenMyPageModal}
          setIsOpenModal={setIsOpenMyPageModal}
        />
        <Toaster />
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
    border: black 1px solid;
    border-radius: 40px;
  `,
  Top: styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: black 1px solid;
    background: white;
  `,
  Body: styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-content: center;
    background: white;
    border-radius: 24px;
  `,
  BottomTab: styled.div`
    width: 420px;
    position: sticky;
    background: white;
    bottom: 70px;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  `,
  PlusIconContainer: styled.div`
    position: absolute;
    bottom: 7%;
    left: 7%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    background: whitesmoke;
    padding: 10px;
  `,
  MyIconContainer: styled.div`
    position: absolute;
    bottom: 7%;
    right: 7%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
    background: whitesmoke;
    padding: 10px;
  `,
  ButtonContainer: styled.div`
    postion: fixed;
    top: 0;
    left: 0;
  `,
  Button: styled.button`
    width: 100px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    ${typographies.NeoButtonL};
    background-color: ${colors.Main_Yellow200};
    border: none;
    cursor: pointer;
  `,
  Title: styled.div`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
};

export default App;
