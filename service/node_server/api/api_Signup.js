const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");
const bcrypt = require("bcryptjs");

router.route("/").post(async (req, res) => {
  const user_id = req.body.user_id;
  const user_pw = req.body.user_pw;
  const user_level = req.body.user_level;

  try {
    const userResult = await pgSQL.query({
      text: "SELECT * FROM cm_user_t WHERE user_id = $1",
      values: [user_id],
    });
    if (userResult.rowCount > 0) {
      sendData.isSuccess = "이미 존재하는 아이디 입니다!";
      return res.send(sendData);
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
