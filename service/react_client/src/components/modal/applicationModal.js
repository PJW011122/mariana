import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { useDropzone } from "react-dropzone";
import { colors } from "../../styles/colors";
import { encode, decode } from "../../asset/util/encodeName.js";
import axios from "axios";

const ApplyModal = ({ isOpenModal, setIsOpenModal, post }) => {
  const [beforeImage, setBeforeImage] = useState(null); // Before 이미지 URL
  const [beforeImagePath, setBeforeImagePath] = useState(null); // Before 이미지 Path
  const [beforeImageExtension, setBeforeImageExtension] = useState(""); // Before 이미지 확장자
  const [afterImage, setAfterImage] = useState(null); // After 이미지 상태
  const [afterImagePath, setAfterImagePath] = useState(null); // Before 이미지 Path
  const [afterImageExtension, setAfterImageExtension] = useState(""); // After 이미지 확장자
  const [content, setContent] = useState(""); // 내용 상태

  const addressJson = localStorage.getItem("address");
  let cood_x = 0;
  let cood_y = 0;
  let street_address = "주소 없음";

  if (addressJson) {
    const parsedAddress = JSON.parse(addressJson);
    cood_x = parsedAddress.cood_x || 0;
    cood_y = parsedAddress.cood_y || 0;
    street_address = parsedAddress.street_address || "주소 없음";
  }

  const closeModal = () => {
    setIsOpenModal(false);
    setBeforeImage(null); // 모달 닫을 때 Before 이미지 초기화
    setBeforeImageExtension(""); // 모달 닫을 때 Before 이미지 확장자 초기화
    setAfterImage(null); // 모달 닫을 때 After 이미지 초기화
  };

  const handleSaveClick = async () => {
    // let data = {};

    // if (post.post_id) {
    //   // 기존 게시글이 있는 상태 (onClick)
    //   data = {
    //     post_id: post.post_id, // 게시물 내용
    //     res_user_id: localStorage.getItem("userId"), // 요청자의 사용자 ID
    //     res_file_path: afterImagePath, // 요청자의 파일 경로
    //     res_file_extension: afterImageExtension, // 요청자의 파일 확장자
    //     co_status: 1, // 상태 값
    //   };
    //   // PUT 요청 함수
    //   try {
    //     const response = await axios.put("/board", data);
    //     return response.data;
    //   } catch (error) {
    //     console.error("manageBoard PUT Error:", error);
    //     throw error;
    //   }
    // } else {
    const data = {
      content: content, // 게시물 내용
      req_user_id: localStorage.getItem("userId"), // 요청자의 사용자 ID
      req_file_path: beforeImagePath, // 요청자의 파일 경로
      req_file_extension: beforeImageExtension, // 요청자의 파일 확장자
      coord_x: cood_x, // X 좌표 (위도)
      coord_y: cood_y, // Y 좌표 (경도)
      co_address: street_address, // 주소
      co_status: 0, // 상태 값
    };

    // POST 요청 함수
    try {
      const response = await axios.post("/board", data);
      return response.data;
    } catch (error) {
      console.error("manageBoard POST Error:", error);
      throw error;
    }
    // }
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

    // 파일 업로드를 위한 FormData 생성 및 인코딩된 파일 이름 설정
    const formData = new FormData();
    const fileName = file.name;
    const dotIndex = fileName.lastIndexOf(".");
    const nameWithoutExt = fileName.substring(0, dotIndex);
    const ext = fileName.substring(dotIndex);

    // 파일 이름을 인코딩하여 확장자와 결합
    const encodedFileName = encode(nameWithoutExt) + ext;
    formData.append("file", file, encodedFileName); // 인코딩된 이름으로 파일 추가

    // 서버에 파일 업로드
    axios
      .post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // 서버에서 받은 파일 이름을 디코딩
        const originalFileName = response.data.file.originalname;
        const dotIndex = originalFileName.lastIndexOf(".");
        const encodedName = originalFileName.substring(0, dotIndex);
        const ext = originalFileName.substring(dotIndex);

        // 이름을 디코딩하여 확장자와 결합
        const decodedFileName = decode(encodedName) + ext;

        // 파일 정보 업데이트
        const fileInfo = response.data.file;
        fileInfo.originalname = decodedFileName; // 디코딩된 이름 사용
        setBeforeImagePath(fileInfo.filename); // Before 이미지 미리보기
      })
      .catch((error) => {
        console.error("파일 업로드 실패:", error);
      });
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
      setAfterImageExtension(file.type.split("/").pop()); // 확장자 추출
    };
    if (file) {
      reader.readAsDataURL(file); // 파일을 URL로 변환
    }

    // 파일 업로드를 위한 FormData 생성 및 인코딩된 파일 이름 설정
    const formData = new FormData();
    const fileName = file.name;
    const dotIndex = fileName.lastIndexOf(".");
    const nameWithoutExt = fileName.substring(0, dotIndex);
    const ext = fileName.substring(dotIndex);

    // 파일 이름을 인코딩하여 확장자와 결합
    const encodedFileName = encode(nameWithoutExt) + ext;
    formData.append("file", file, encodedFileName); // 인코딩된 이름으로 파일 추가

    // 서버에 파일 업로드
    axios
      .post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // 서버에서 받은 파일 이름을 디코딩
        const originalFileName = response.data.file.originalname;
        const dotIndex = originalFileName.lastIndexOf(".");
        const encodedName = originalFileName.substring(0, dotIndex);
        const ext = originalFileName.substring(dotIndex);

        // 이름을 디코딩하여 확장자와 결합
        const decodedFileName = decode(encodedName) + ext;

        // 파일 정보 업데이트
        const fileInfo = response.data.file;
        fileInfo.originalname = decodedFileName; // 디코딩된 이름 사용
        setAfterImagePath(fileInfo.filename); // Before 이미지 미리보기
      })
      .catch((error) => {
        console.error("파일 업로드 실패:", error);
      });
  };

  const { getRootProps: getRootPropsAfter, getInputProps: getInputPropsAfter } =
    useDropzone({ onDrop: onDropAfter });

  if (isOpenModal)
    return (
      <S.Wrapper onClick={closeModal}>
        <S.Container onClick={(e) => e.stopPropagation()}>
          <S.IconContainer>
            <IoClose size={30} onClick={closeModal} />
          </S.IconContainer>
          <S.Header>
            <S.TextWrapper>
              <S.Title>제보 올리기</S.Title>
              <S.Description>{cood_x}, {cood_y}</S.Description>
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
          <S.Textarea
            placeholder={"전동 킥보드는 어떻게 놓여있었나요?!"}
            onChange={(e) => setContent(e.target.value)}
          />
          <S.ButtonContainer>
            <S.Button onClick={handleSaveClick}>
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
    padding: 24px 0 16px 0;
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
    padding-top: 40px;
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
    ${typographies.PretendardRegular};
    font-size: 20px;
    background-color: ${colors.Main_Yellow200};
  `,
  IconContainer: styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
  `,
};

export default ApplyModal;
