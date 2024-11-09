import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { useDropzone } from "react-dropzone";

const ApplyModal = ({ isOpenModal, setIsOpenModal }) => {  // removed unused props
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const closeModal = () => {
    setIsOpenModal(false);
  };

  if (!isOpenModal) return null;  // early return if modal is closed

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
        <S.DropzoneContainer {...getRootProps()}>
          <div>이미지를 드래그하거나 클릭하여 업로드하세요</div>
          {preview && <S.PreviewImage src={preview} alt="Preview" />}
          <input {...getInputProps()} multiple={false} name="imageUrl" />
        </S.DropzoneContainer>
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
  Title: styled.div`
    ${typographies.PretendardRegular}
    font-size: 25px;
    font-weight: 600;
  `,
  DropzoneContainer: styled.div`
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 4px;
    margin: 20px;
    text-align: center;
    cursor: pointer;
    
    &:hover {
      border-color: #999;
    }
  `,
  PreviewImage: styled.img`
    max-width: 100%;
    height: auto;
    margin-top: 10px;
  `,
};

export default ApplyModal;