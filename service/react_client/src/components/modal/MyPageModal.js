import styled from "@emotion/styled";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { colors } from "../../styles/colors";
import axios from "axios";
import toast from "react-hot-toast";

const MyPageModal = ({ isOpenModal, setIsOpenModal }) => {
  const [point, setPoint] = useState(0);
  const closeModal = () => {
    setIsOpenModal(false);
  };
  const userId = localStorage.getItem("userId");

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <S.TextWrapper></S.TextWrapper>
            <S.TextWrapper onClick={closeModal}>
              <IoClose size={40} />
            </S.TextWrapper>
          </S.Header>
          <S.Body>
            <img src={"images/pinkbean.png"} width={120} height={160} />
            <S.TitleContainer>
              <S.Title>{`${userId}님 `}</S.Title>
              <S.SubTile1>오늘도</S.SubTile1>
              <S.SubTile2>치얼 업!</S.SubTile2>
            </S.TitleContainer>
            <S.DescriptionContainer>
              <S.Description>누적 Cheer Point : {point}</S.Description>
              <S.Description>다음 레벨까지 </S.Description>
            </S.DescriptionContainer>
          </S.Body>
        </S.Container>
      </S.Wrapper>
    );
};

const S = {
  Wrapper: styled.div`
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  `,
  Container: styled.div`
    position: fixed;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    height: 800px; /* 높이 조정 */
    width: 360px;
    border-radius: 12px;
    padding: 20px; /* Padding 추가 */
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
  `,
  TextWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `,
  Title: styled.span`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
  SubTile1: styled.span`
    ${typographies.PretendardRegular};
    font-size: 25px;
    font-weight: 600;
  `,
  SubTile2: styled.span`
    ${typographies.PretendardRegular};
    font-size: 25px;
    font-weight: 600;
    color: ${colors.Main_Red700};
  `,
  Body: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 30px;
    gap: 20px;
  `,
  TitleContainer: styled.div`
    display: flex;
    gap: 10px;
  `,
  DescriptionContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
  `,
  Description: styled.div`
    ${typographies.PretendardRegular};
    font-size: 17px;
    font-weight: 200;
    color: ${colors.Gray300};
  `,
};

export default MyPageModal;
