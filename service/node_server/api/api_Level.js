/*
 * 작성자: 박준우
 * 작성일: 241109
 * 설명: 리워드 (user_id로 호출하면 무조건 +1)
 *      [put:update]
 *
 * 호출 예:
 *  PUT ::: {user_id(필수)}
 */

const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");

router.route("/").put(async (req, res) => {
  // 수정(update)
  let conditions2 = [];
  let values = [];
  let count = 1;

  Object.entries(req.body).forEach(([key, value]) => {
    if (key !== "user_level") {
      conditions2.push(`${key} = $${count}`);
      values.push(value);
      count += 1;
    }
  });

  const conditionClause = "SET user_level = user_level + 1";
  const condition2Clause = conditions2.length
    ? "WHERE " + conditions2.join(" AND ")
    : "";
  try {
    const result = await pgSQL.query({
      text: `UPDATE cm_user_t ${conditionClause} ${condition2Clause} RETURNING *`,
      values: values,
    });
    return res.send(result.rows[0]); // 업데이트된 데이터 반환
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
