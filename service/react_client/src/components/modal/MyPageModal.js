import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { typographies } from "../../styles/typhographies";
import { colors } from "../../styles/colors";
import axios from "axios";

const MyPageModal = ({ isOpenModal, setIsOpenModal }) => {
  const [postCount, setPostCount] = useState(0);
  const [postCountLank, setPostCountLank] = useState(0);
  const [levelTitle, setLevelTitle] = useState("");
  const [leftLevelPoint, setLeftLevelPoint] = useState(0);
  const [levelPoint, setLevelPoint] = useState(0);
  const userId = localStorage.getItem("userId");

  const closeModal = () => {
    setIsOpenModal(false);
  };

  function getRewardTitle(reward) {
    let status;
    let pointsNeeded;

    const levels = [
      { title: "치어", max: 500 },
      { title: "치워러", max: 1000 },
      { title: "치워리더", max: 2000 },
      { title: "치워리스트", max: Infinity },
    ];

    const currentLevel = levels.find((level) => reward <= level.max);
    status = currentLevel.title;
    pointsNeeded =
      currentLevel.max === Infinity ? 0 : currentLevel.max + 100 - reward;

    setLeftLevelPoint(pointsNeeded);
    return status;
  }

  function getRewardTitleImage(rewardTitle) {
    if (rewardTitle === "치어") {
      return <img src={`images/pinkbean.png`} width={120} height={160} />;
    } else if (rewardTitle === "치워러") {
      return <img src={`images/pinkbean2.png`} width={120} height={160} />;
    } else if (rewardTitle === "치워리더") {
      return <img src={`images/pinkbean3.png`} width={120} height={160} />;
    } else if (rewardTitle === "치워리스트") {
      return <img src={`images/pinkbean4.png`} width={120} height={160} />;
    } else {
      return <img src={`images/pinkbean.png`} width={120} height={160} />; // 예외 처리
    }
  }

  const displayPostCountsWithRank = (response, targetUserId) => {
    // 게시글 수 세기 및 정렬
    const userPostCount = response.rows.reduce((acc, post) => {
      acc[post.req_user_id] = (acc[post.req_user_id] || 0) + 1;
      return acc;
    }, {});

    const sortedPostCounts = Object.entries(userPostCount).sort(
      ([, a], [, b]) => b - a
    );

    // 결과 출력
    sortedPostCounts.forEach(([id, count]) => {
      if (id === targetUserId) {
        setPostCount(count);
      }
    });

    // 특정 사용자의 순위 찾기
    const rank =
      sortedPostCounts.findIndex(([userId]) => userId === targetUserId) + 1;
    if (rank) {
      setPostCountLank(rank);
    } else {
      setPostCountLank("???");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.put("/level", {
          user_id: userId,
        });
        const response2 = await axios.get("/board", {});

        const userLevel = response1.data.user_level;
        setLevelPoint(userLevel);
        setLevelTitle(getRewardTitle(userLevel));

        // rows가 정의되어 있는지 확인
        const userPosts = response2.data.rows?.filter(
          (post) => post.req_user_id === userId
        );
        setPostCount(userPosts ? userPosts.length : 0); // userPosts가 null일 경우 0으로 설정

        displayPostCountsWithRank(response2, userId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

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
            {getRewardTitleImage(levelTitle)}
            <div>{levelTitle}</div>
            <S.TitleContainer>
              <S.Title>{`${userId}님 `}</S.Title>
              <S.SubTile1>오늘도</S.SubTile1>
              <S.SubTile2>치얼 업!</S.SubTile2>
            </S.TitleContainer>
            <S.DescriptionContainer>
              <S.Description>누적 Cheer Point: {levelPoint}</S.Description>
              <S.Description>
                다음 레벨까지 {leftLevelPoint} Cheer Point 남았어요.
              </S.Description>
            </S.DescriptionContainer>

            <S.RankTitleContainer>
              <div>
                <S.RankSubTile1>총 </S.RankSubTile1>
                <S.RankSubTile2>{postCount}</S.RankSubTile2>
                <S.RankSubTile1>번으로</S.RankSubTile1>
              </div>
              <div>
                <S.RankSubTile1>서울에서 </S.RankSubTile1>
                <S.RankSubTile2>{postCountLank}</S.RankSubTile2>
                <S.RankSubTile1>번째로 많이 </S.RankSubTile1>
                <div>
                  <S.RankSubTile1>킥보드를 정리했어요</S.RankSubTile1>
                </div>
              </div>
            </S.RankTitleContainer>
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
    padding-top: 20px;
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
    align-items: center;
    gap: 5px;
  `,
  Description: styled.div`
    ${typographies.PretendardRegular};
    font-size: 17px;
    font-weight: 200;
    color: ${colors.Gray300};
  `,
  RankTitleContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  `,
  RankSubTile1: styled.span`
    ${typographies.PretendardRegular};
    font-size: 20px;
    font-weight: 600;
  `,
  RankSubTile2: styled.span`
    ${typographies.PretendardRegular};
    font-size: 20px;
    font-weight: 600;
    color: ${colors.Main_Red700};
  `,
};

export default MyPageModal;
