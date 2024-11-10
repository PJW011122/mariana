import styled from "@emotion/styled";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { colors } from "../../styles/colors";
import axios from "axios";
import toast from "react-hot-toast";

const LoginModal = ({ isOpenModal, setIsOpenModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const closeModal = () => {
    setIsOpenModal(false);
    setUsername(""); // 모달 닫을 때 아이디 초기화
    setPassword(""); // 모달 닫을 때 비밀번호 초기화
    setError(""); // 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 회원가입 로직 추가 (API 호출 등)
    const response = await axios.post("/signin", {
      user_id: username,
      user_pw: password,
    });
    localStorage.setItem("userId", response.data);
    toast.success("로그인에 성공하셨어요!");
    setError("");
    window.location.reload();
    closeModal(); // 모달 닫기
  };

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <S.TextWrapper>
              <S.Title>로그인</S.Title>
            </S.TextWrapper>
            <S.TextWrapper onClick={closeModal}>
              <IoClose size={30} />
            </S.TextWrapper>
          </S.Header>
          <form onSubmit={handleSubmit}>
            <S.InputContainer>
              <S.Input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <S.Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <S.ErrorText>{error}</S.ErrorText>}
            </S.InputContainer>
            <S.ButtonContainer>
              <S.Button type="submit">
                <div>로그인</div>
              </S.Button>
            </S.ButtonContainer>
          </form>
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
    height: 400px; /* 높이 조정 */
    width: 360px;
    border-radius: 12px;
    padding: 20px; /* Padding 추가 */
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    border-bottom: 0.5px solid black;
  `,
  TextWrapper: styled.div`
    padding: 24px 16px 16px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `,
  Title: styled.div`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
  InputContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px; /* 입력 필드 간의 간격 */
    margin-top: 20px; /* 상단 여백 추가 */
  `,
  Input: styled.input`
    border: 2px solid #cccccc;
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    background-color: #f9f9f9;
  `,
  ErrorText: styled.p`
    color: red;
    font-size: 12px;
  `,
  ButtonContainer: styled.div`
    display: flex;
    padding-top: 90px;
    justify-content: flex-end;
    width: 100%;
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
    border: none; /* 버튼의 기본 테두리 제거 */
    cursor: pointer; /* 커서 포인터로 변경 */
  `,
};

export default LoginModal;
