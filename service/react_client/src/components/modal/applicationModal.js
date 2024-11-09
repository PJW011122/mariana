import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { IoClose, IoHeart } from "react-icons/io5";
import axios from "axios";
import { typographies } from "../../styles/typhographies";
import { useDropzone } from "react-dropzone";
import { colors } from "../../styles/colors";

const ApplyModal = ({ title, description, isOpenModal, setIsOpenModal, postId, userId }) => {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchLikeStatus();
  }, []);

  const fetchLikeStatus = async () => {
    try {
      // Make a GET request to fetch the like count and user's like status for the post
      const response = await axios.get("/like", { params: { post_id: postId, user_id: userId } });
      setLikes(response.data.likeCount);
      setIsLiked(response.data.isLiked); // Assuming the API returns if the user has liked the post
    } catch (error) {
      console.error("like GET Error:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        // If already liked, send a DELETE request to remove the like
        const response = await axios.delete("/like", { params: { post_id: postId, user_id: userId } });
        setLikes((prev) => prev - 1);
      } else {
        // If not liked, send a POST request to add a like
        const response = await axios.post("/like", { user_id: userId, post_id: postId });
        setLikes((prev) => prev + 1);
      }
      // Toggle the like status
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setBeforeImage(null);
    setAfterImage(null);
  };

  const onDropBefore = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBeforeImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onDropAfter = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAfterImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const {
    getRootProps: getRootPropsBefore,
    getInputProps: getInputPropsBefore,
  } = useDropzone({ onDrop: onDropBefore });
  const { getRootProps: getRootPropsAfter, getInputProps: getInputPropsAfter } =
    useDropzone({ onDrop: onDropAfter });

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.Header>
            <S.TextWrapper>
              <S.Title>게시글 올리기</S.Title>
            </S.TextWrapper>
            <S.TextWrapper onClick={closeModal}>
              <IoClose size={30} />
            </S.TextWrapper>
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
          <S.LikeContainer>
            <S.LikeButton onClick={handleLike}>
              <IoHeart size={24} color={isLiked ? "#ff7a50" : "#ccc"} />
            </S.LikeButton>
            <S.LikeCount>{likes}</S.LikeCount>
          </S.LikeContainer>
          <S.Textarea placeholder={"전동 킥보드는 어떻게 놓여있었나요?!"} />
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
    padding: 20px;
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
  ImagesContainer: styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
    width: 48%;
    background-color: #f9f9f9;
    flex-direction: column;
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
  Textarea: styled.textarea`
    border: 2px solid #cccccc;
    margin-top: 10px;
    width: 100%;
    height: 120px;
    background-color: #f9f9f9;
  `,
  ButtonContainer: styled.div`
    display: flex;
    padding-top: 20px;
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
  LikeContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    position: relative;
    right: -125px;
    top: -10px;
  `,
  LikeButton: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;

    &:hover {
      transform: scale(1.1);
    }
  `,
  LikeCount: styled.div`
    margin-top: 5px;
    font-size: 16px;
    color: #ff7a50;
    text-align: center;
  `,
};

export default ApplyModal;
