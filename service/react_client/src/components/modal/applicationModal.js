import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { useDropzone } from "react-dropzone";
import { colors } from "../../styles/colors";
import axios from "axios";

const ApplyModal = ({ isOpenModal, setIsOpenModal }) => {
  const [beforeImage, setBeforeImage] = useState(null); // Before 이미지 URL
  const [beforeImageExtension, setBeforeImageExtension] = useState(""); // Before 이미지 확장자
  const [afterImage, setAfterImage] = useState(null); // After 이미지 상태
  const [content, setContent] = useState(""); // 내용 상태

  const addressJson = localStorage.getItem("address");
  const userId = localStorage.getItem("userId");
  const { cood_x, cood_y, street_address } = JSON.parse(addressJson);

  const closeModal = () => {
    setIsOpenModal(false);
    setBeforeImage(null); // 모달 닫을 때 Before 이미지 초기화
    setBeforeImageExtension(""); // 모달 닫을 때 Before 이미지 확장자 초기화
    setAfterImage(null); // 모달 닫을 때 After 이미지 초기화
  };

  // Before 사진 드래그 로직
  const onDropBefore = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBeforeImage(reader.result); // Before 이미지 미리보기
      setBeforeImageExtension(file.type.split("/").pop()); // 확장자 추출
    };
    if (file) {
      reader.readAsDataURL(file); // 파일을 URL로 변환
    }
  };

  useEffect(() => {
    console.log(beforeImage);
    console.log(beforeImageExtension);
  }, [beforeImage, beforeImageExtension]);

  const {
    getRootProps: getRootPropsBefore,
    getInputProps: getInputPropsBefore,
  } = useDropzone({ onDrop: onDropBefore });

  // After 사진 드래그 로직
  const onDropAfter = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAfterImage(reader.result); // After 이미지 미리보기
    };
    if (file) {
      reader.readAsDataURL(file); // 파일을 URL로 변환
    }
  };

  const { getRootProps: getRootPropsAfter, getInputProps: getInputPropsAfter } =
    useDropzone({ onDrop: onDropAfter });

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <S.TextWrapper>
              <S.Title>제보 올리기</S.Title>
              <S.Description>{street_address}</S.Description>
            </S.TextWrapper>
            <IoClose size={30} onClick={closeModal} />
          </S.Header>
          <S.ImagesContainer>
            <S.Dropzone {...getRootPropsBefore()} style={{ cursor: "pointer" }}>
              <input {...getInputPropsBefore()} />
              {beforeImage ? (
                <S.ImagePreview src={beforeImage} alt="Before" />
              ) : (
                <div>Before 사진을 드래그하거나 클릭하여 업로드하세요.</div>
              )}
            </S.Dropzone>
            <S.Dropzone {...getRootPropsAfter()} style={{ cursor: "pointer" }}>
              <input {...getInputPropsAfter()} />
              {afterImage ? (
                <S.ImagePreview src={afterImage} alt="After" />
              ) : (
                <div>After 사진을 드래그하거나 클릭하여 업로드하세요.</div>
              )}
            </S.Dropzone>
          </S.ImagesContainer>
          <S.Textarea
            placeholder={"전동 킥보드는 어떻게 놓여있었나요?!"}
            onChange={(e) => setContent(e.target.value)}
          />
          <S.ButtonContainer>
            <S.Button>
              <div>저장</div>
            </S.Button>
          </S.ButtonContainer>
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
    height: 600px;
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
    justify-content: flex-start;
    gap: 10px;
  `,
  ImagesContainer: styled.div`
    display: flex;
    justify-content: space-between; /* 두 영역을 좌우로 나누기 */
    margin-top: 20px; /* 상단 여백 추가 */
    gap: 20px;
  `,
  Dropzone: styled.div`
    border: 2px dashed #cccccc;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 48%; /* 두 영역을 나누기 위한 너비 */
    background-color: #f9f9f9;
    flex-direction: column; /* 세로 정렬 */
  `,
  ImagePreview: styled.img`
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
  `,
  Title: styled.div`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
  Description: styled.div`
    ${typographies.PretendardRegular}
    font-size: 12px;
    font-weight: 400;
  `,
  Textarea: styled.textarea`
    border: 2px solid #cccccc;
    margin-top: 20px;
    width: 99%;
    height: 120px;
    background-color: #f9f9f9;
  `,
  ButtonContainer: styled.div`
    display: flex;
    padding-top: 50px;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
  `,
  Button: styled.div`
    width: 100px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    ${typographies.NeoButtonL};
    background-color: ${colors.Main_Yellow200};
  `,
};

export default ApplyModal;
