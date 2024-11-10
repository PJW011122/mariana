/*
 * 작성자: 박준우
 * 작성일: 241109
 * 설명: 로그인
 *      [post:insert]
 *
 *      id가 틀렸는지 비밀번호가 틀렸는지 판별 못함
 *      그냥 로그인 됐으면 true(state 200),
 *           비밀번호 일치 안됐으면 false(state 401) 반환,
 *           아이디 일치 안됐으면 false(state 402) 반환
 *
 * 호출 예:
 *  POST ::: {user_id(필수), user_pw(필수)}
 */

const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");
const bcrypt = require("bcryptjs");

router.route("/").post(async (req, res) => {
  // client에서 넘어온 정보
  const { user_id, user_pw } = req.body;

  // 로그인 판단 위한 db 검색
  try {
    const userResult = await pgSQL.query({
      text: "SELECT user_id, user_pw FROM cm_user_t WHERE user_id = $1",
      values: [user_id],
    });

    // 아이디 일치 여부 확인
    if (userResult.rowCount == 0) {
      return res.status(402).send(false);
    }

    // 비밀번호 일치 여부 확인
    const matchResult = await bcrypt.compareSync(
      user_pw,
      userResult.rows[0].user_pw
    );
    if (!matchResult) {
      return res.status(401).send(false);
    } else {
      return res.status(200).send(user_id);
    }
  } catch (err) {
    console.log("api_Signin ::: DB SEARCH Error:", err);
    return res.status(400).send("DB SEARCH Error:", err);
  }
});

module.exports = router;
