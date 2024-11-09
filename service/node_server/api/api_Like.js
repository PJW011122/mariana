/*
 * 작성자: 박준우
 * 작성일: 241109
 * 설명: 좋아요 관리
 *      [get:select   post:insert   put:update   delete:delete]
 * 자식 연결: api_file
 *
 * 호출 예:
 *  GET ::: {category(필수), title, content, user_id}
 *  POST ::: {category(필수), post_id(필수), title(필수), content(필수), user_id(필수)}
 *  DELETE ::: {category(필수), post_id(필수), user_id(필수)}
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
        text: `SELECT * FROM cm_boardlike_t ${conditionClause}`,
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

    conditions.push("like_id");
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
        text: `INSERT INTO cm_boardlike_t ${conditionClause}`,
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
        text: `DELETE FROM cm_boardlike_t ${conditionClause} RETURNING *`,
        values: values,
      });
      console.log(result);
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
