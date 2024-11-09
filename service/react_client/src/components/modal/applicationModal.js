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

  const [preview, setPreview] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((preValues) => ({
      ...preValues,
      [name]: value,
    }));

    if (e.target.name === "imageUrl") {
      setPreview(e.target.value);
    }
  };

  const onDrop = (aceeptedFiles) => {
    const reader = new FileReader();
    const file = aceeptedFiles;

    if (file) {
      reader.readAsDataURL(file[0]);
      setImage(file[0]);
    }
    reader.onload = (e) => {
      setPreview(reader.result);
      document.getElementsByName("imageUrl")[0].value = "";
    };
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
            <div>dsd</div>
            <image src={preview} />
            <input {...getInputProps()} multiple={false} name="imageUrl" />
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
  ImageContainer: styled.div`
    width: 40px;
    height: 40px;
    border: 1px black solid;
  `,
  Image: styled.image``,
};

export default ApplyModal;
