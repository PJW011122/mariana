/*
 * 작성자: 박준우
 * 작성일: 241109
 * 설명: 회원가입
 *      [post:insert]
 *
 *      id가 틀렸는지 비밀번호가 틀렸는지 판별 못함
 *      그냥 로그인 됐으면 true(state 200),
 *          추가 안됐으면 false(state 401) 반환,
 *          아이디 중복이면 false(state 402) 반환
 *
 *      user_level은 0으로 고정합니다.
 *
 * 호출 예:
 *  POST ::: {user_id(필수), user_pw(필수)}
 */

const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");
const bcrypt = require("bcryptjs");

router.route("/").post(async (req, res) => {
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;
  const user_level = 0;

  try {
    const userResult = await pgSQL.query({
      text: "SELECT * FROM cm_user_t WHERE user_id = $1",
      values: [user_id],
    });
    if (userResult.rowCount > 0) {
      return res.status(402).send(false);
    } else {
      const hashed_user_pw = bcrypt.hashSync(user_pw, 10);
      const insertResult = await pgSQL.query({
        text: "INSERT INTO cm_user_t (user_id, user_pw, user_level) VALUES($1, $2, $3)",
        values: [user_id, hashed_user_pw, user_level],
      });

      if (insertResult.rowCount > 0) {
        return res.status(200).send(true);
      } else {
        return res.status(401).send(false);
      }
    }
  } catch (error) {
    console.error("서버 오류 발생:", error);
    sendData.isSuccess = "서버 오류가 발생했습니다.";
  }
});

module.exports = router;
