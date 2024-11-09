import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useCallback, useState } from "react";
import Text from "../Text/Text";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { useDropzone } from "react-dropzone";

const ApplyModal = ({ title, description, isOpenModal, setIsOpenModal }) => {
  const closeModal = () => {
    setIsOpenModal(false);
  };

  const [thumbnailPreview, setThumbnailPreview] = useState();
  //사진이 추가됐을 때 그 사진의 정보 상태담기
  const onDropThumbnail = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    //file 첫번째 파일을 저장
    const fileURL = URL.createObjectURL(file);
    //createObjectURL는 임시로 URL을 저장할수 있는 메서드
    setThumbnailPreview({ url: fileURL, name: file.name, size: file.size });
  }, []);

  //받는 이미지 확장자 리밋 설정
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //이미지가 들어가면 실행되는 함수
    onDrop: onDropThumbnail,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  //저장된 상태 삭제하기 ( 이미지 삭제 )
  const handleDeleteThumbnail = (e) => {
    e.stopPropagation(); // 이벤트 버블링 막기 위해 사용
    setThumbnailPreview(undefined);
  };

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <S.TextWrapper>
              <S.Title>게시글 올리기</S.Title>
            </S.TextWrapper>
            <S.TextWrapper onClick={closeModal}>
              <IoClose size={25} />
            </S.TextWrapper>
          </S.Header>
          <div {...getRootProps()}>
            <input {...getInputProps} />
            {isDragActive ? (
              <p>여기에 놓아주세요.</p>
            ) : (
              <p>이미지를 여기에 드롭하시거나, 클릭주세요.</p>
            )}
          </div>
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
    width: 350px;
    border-radius: 12px;
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
  `,
  TextWrapper: styled.div`
    padding: 24px 16px 16px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `,
  Button: styled.div`
    padding: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Title: styled.div`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
};

export default ApplyModal;
