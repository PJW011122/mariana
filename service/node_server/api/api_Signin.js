const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");
const bcrypt = require("bcryptjs");
const tokenUtil = require("../util/token.js");

router.route("/").post(async (req, res) => {
  // client에서 넘어온 정보
  const { user_id, user_pw, rememberMe } = req.body;

  // 로그인 판단 위한 db 검색
  try {
    const userResult = await pgSQL.query({
      text: "SELECT user_id, user_pw FROM cm_user_t WHERE user_id = $1",
      values: [user_id],
    });

    // 아이디 일치 여부 확인
    if (userResult.rowCount == 0) {
      return res.status(401).send("아이디가 일치하지 않습니다.");
    }

    // 비밀번호 일치 여부 확인
    const matchResult = await bcrypt.compareSync(
      user_pw,
      userResult.rows[0].user_pw
    );
    if (!matchResult) {
      return res.status(401).send("비밀번호가 일치하지 않습니다.");
    } else {
      // 로그인 정보 일치시 토큰 발급
      const accessToken = tokenUtil.makeAccessToken({ id: user_id });
      const refreshToken = tokenUtil.makeRefreshToken();

      try {
        const insertResult = await pgSQL.query({
          //user_id에서 충돌(중복, ON CONFLICT) 발생 시 user_token 값을 update
          text: `INSERT INTO cm_usertoken_t (user_id, user_token)
                  VALUES ($1, $2)
                  ON CONFLICT (user_id)
                  DO UPDATE SET user_token = EXCLUDED.user_token`,
          values: [user_id, refreshToken],
        });
        if (insertResult.rowCount > 0) {
          // 쿠키에 토큰 저장
          res.cookie("accessToken", accessToken, {
            httpOnly: true, // JavaScript에서 접근 불가
            secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
            sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
            maxAge: 10 * 60 * 1000, // 10분
          });

          if (rememberMe) {
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true, // JavaScript에서 접근 불가
              secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
              sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
              maxAge: 14 * 24 * 60 * 60 * 1000, // 2주
            });
          }

          res.cookie("user_id", user_id, {
            httpOnly: true, // JavaScript에서 접근 불가
            secure: true, // HTTPS 환경에서만 사용 (배포 환경에서 활성화)
            sameSite: "Strict", // 쿠키를 동일한 사이트에서만 전송하도록 설정
            maxAge: 14 * 24 * 60 * 60 * 1000, // 2주
          });
          return res.status(200).json({ success: true });
        }
      } catch (err) {
        console.log("api_Signin ::: DB INSERT Error:", err);
        return res.status(400).send("DB INSERT Error:", err);
      }
    }
  } catch (err) {
    console.log("api_Signin ::: DB SEARCH Error:", err);
    return res.status(400).send("DB SEARCH Error:", err);
  }
});

module.exports = router;
