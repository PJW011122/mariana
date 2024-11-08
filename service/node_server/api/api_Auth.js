/*
 * 작성자: 박준우
 * 작성일: 240810
 * 설명: jsonwebtoken module 같은 경우 buffer랑 crypto를 사용해서
 * webpack 5 환경에서 오류 발생 따라서 token 인증과 같은 파트를 모두 서버로 넘겨서 처리한다.
 * 쓰읍... 뭔가 에러날 때 불안정한거 같은데... 어딘질 모르겄네
 * 부모 연결:
 * 자식 연결:
 */

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const token = require("../util/token.js");
const pgSQL = require("../../postgres_db/index");

// 로그인된 사용자 정보 반환
router.route("/user").post(async (req, res) => {
  try {
    const { user_pw } = req.body;
    const user_id = req.cookies.user_id; // HttpOnly 쿠키에서 user_id 가져오기
    if (!user_id) {
      return res.status(401).json({ message: "로그인되어 있지 않습니다." });
    }

    const userResult = await pgSQL.query({
      text: "SELECT user_id, user_pw, user_level FROM cm_user_t WHERE user_id = $1",
      values: [user_id],
    });
    // 아이디 일치 여부 확인
    if (userResult.rowCount !== 1) {
      return res.status(401).json("아이디가 일치하지 않습니다.");
    }

    // 비밀번호 일치 여부 확인
    let matchResult = null; // matchResult를 상위 범위에 선언

    if (user_pw) {
      matchResult = await bcrypt.compareSync(
        user_pw,
        userResult.rows[0].user_pw
      );
    }

    return res.status(200).json({
      matchResult: matchResult,
      user_id: userResult.rows[0].user_id,
      user_level: userResult.rows[0].user_level,
    });
  } catch (err) {
    console.error("DB SEARCH Error:", err);
    return res
      .status(500)
      .json({ message: "서버 오류 발생", error: err.message });
  }
});

// accessToken 유효성 검사
router.route("/accVer").post(async (req, res) => {
  const accessToken = req.cookies.accessToken; // HttpOnly 쿠키에서 accessToken을 가져옴
  const result = await token.accessVerify(accessToken);
  console.log("api_auth ::: accVer ", result);
  res.send(result);
});

// accessToken 갱신 (authInterceptor.js에서 accessToken 만료시 진입)
router.route("/refresh").post(async (req, res) => {
  const user_id = req.cookies.user_id; // HttpOnly 쿠키에서 user_id를 가져옴
  const accessToken = req.cookies.accessToken; // HttpOnly 쿠키에서 accessToken을 가져옴
  const refreshToken = req.cookies.refreshToken; // HttpOnly 쿠키에서 refreshToken을 가져옴
  // 토큰이 없는 경우
  if (!refreshToken) {
    return res.status(401).send("Unauthorized! refreshToken 존재 X.");
  }

  // accessToken이 없거나 유효하지 않으면 디코드할 수 없으므로 조건 처리
  let decoded;
  if (accessToken) {
    decoded = jwt.decode(accessToken);
    if (!decoded) {
      return res.status(401).send("Unauthorized! accessToken 검증 실패");
    }
  }

  // 리프레시 토큰의 유효성 검사
  const refreshResult = await token.refreshVerify(refreshToken, user_id);
  if (refreshResult === false) {
    // 리프레시 토큰이 만료되었거나 유효하지 않음
    return res.status(401).send("Unauthorized! Please sign in again.");
  }

  // 새로운 액세스 토큰 발급
  const newAccessToken = token.makeAccessToken({ id: user_id });

  // 새로운 액세스 토큰을 HttpOnly 쿠키로 설정
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
    sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
    // 도메인만 동일하다면 서브도메인을 포함한 모든 페이지가 동일한 사이트로 간주 (서브 도메인끼리 서로 다르면 다른 사이트로 간주)
    maxAge: 10 * 60 * 1000, // 10분
  });

  return res.status(200).send("Access token 갱신 완료");
});

module.exports = router;
