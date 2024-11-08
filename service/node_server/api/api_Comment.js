/*
 * 작성자:
 * 작성일:
 * 설명: delete의 경우 on delete cascade 처리하기 때문에 필요x
 * 부모 연결:
 * 자식 연결:
 */
const router = require("express").Router();
const pgSQL = require("../../postgres_db/index");
const { uuid } = require("../util/generateKey");

router
  .route("/")
  .get(async (req, res) => {
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
        text: `SELECT * FROM cm_comment_t ${conditionClause}`,
        values: values,
      });
      return res.status(200).send(selectResult);
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  })
  .post(async (req, res) => {
    // 추가(insert)
    // SQL 구성
    let conditions = [];
    let conditions2 = [];
    let values = [];

    conditions.push("comment_id");
    conditions2.push(`$${conditions2.length + 1}`);
    values.push(uuid());

    Object.entries(req.body).forEach(([key, value]) => {
      conditions.push(`${key}`);
      conditions2.push(`$${conditions2.length + 1}`);
      values.push(value);
    });
    const keyClause = conditions.length ? conditions.join(", ") : "";
    const valClause = conditions2.length ? conditions2.join(", ") : "";
    const conditionClause = `(${keyClause}) VALUES (${valClause})`;
    try {
      const insertResult = await pgSQL.query({
        text: `INSERT INTO cm_comment_t ${conditionClause}`,
        values: values,
      });

      if (insertResult.rowCount > 0) {
        return res.status(200).send();
      } else {
        return res.status(500).send();
      }
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  })
  .put(async (req, res) => {
    // 수정(update)
    let count = 0;
    let conditions = [];
    let conditions2 = [];
    let values = [];
    Object.entries(req.body).forEach(([key, value]) => {
      count = count + 1;
      values.push(value);
      if (key === "comment") {
        conditions.push(`${key} = $${count}`);
      } else {
        conditions2.push(`${key} = $${count}`);
      }
    });
    const conditionClause = conditions.length
      ? "SET " + conditions.join(" , ")
      : "";
    const condition2Clause = conditions2.length
      ? "WHERE " + conditions2.join(" AND ")
      : "";
    try {
      const result = await pgSQL.query({
        text: `UPDATE cm_comment_t ${conditionClause} ${condition2Clause} RETURNING *`,
        values: values,
      });
      return res.send(result.rows[0]); // 업데이트된 데이터 반환
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  })
  .delete(async (req, res) => {
    // 삭제(delete)
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
      const result = await pgSQL.query({
        text: `DELETE FROM cm_comment_t ${conditionClause} RETURNING *`,
        values: values,
      });
      if (result.rowCount === 0) {
        return res.status(404).send("No items found matching the criteria");
      }
      return res.status(200).send(result.rows[0]); // 삭제된 데이터 반환
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  });

module.exports = router;
