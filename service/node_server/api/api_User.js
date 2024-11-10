const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");

router.route("/").get(async (req, res) => {
  // 조회(select)
  // SQL 구성
  let conditions = [];
  let values = [];
  Object.entries(req.query).forEach(([key, value]) => {
    conditions.push(`${key} = $${conditions.length + 1}`);
    values.push(value);
  });
  const conditionClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";
  try {
    const selectResult = await pgSQL.query({
      text: `SELECT * FROM cm_user_t ${conditionClause}`,
      values: values,
    });
    return res.status(200).send(selectResult);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
