/*
 * 작성자: 박준우
 * 작성일: 240901
 * 설명: 로그아웃 처리
 */
const router = require("express").Router();

router.post("/", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
    sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
  });
  res.clearCookie("refreshToken", {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
    sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
  });
  res.clearCookie("user_id", {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
    sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
  });

  // 로그아웃 완료 후 응답 반환
  res.status(200).json({ message: "로그아웃이 완료되었습니다." });
});

module.exports = router;
