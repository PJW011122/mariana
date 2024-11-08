/*
 * 작성자:
 * 작성일:
 * 설명:
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
    let dbTable = "";
    let dbExceptColumns = [];
    let conditions = [];
    let values = [];
    Object.entries(req.query).forEach(([key, value]) => {
      if (key === "db") {
        switch (value) {
          case "account":
            dbTable = "cm_user_t";
            dbExceptColumns = ["user_pw"];
            break;
          case "post":
            dbTable = "cm_board_t";
            break;
          default:
            return res.status(400).send("Invalid db parameter");
        }
      } else {
        conditions.push(`${key} = $${conditions.length + 1}`);
        values.push(value);
      }
    });
    const conditionClause = conditions.length
      ? "WHERE " + conditions.join(" AND ")
      : "";
    try {
      const selectResult = await pgSQL.query({
        text: `SELECT * FROM ${dbTable} ${conditionClause}`,
        values: values,
      });

      // 제외할 열을 제거한 결과 생성
      const filteredResult = selectResult.rows.map((row) => {
        // dbExceptColumns에 있는 열을 row에서 제거
        dbExceptColumns.forEach((col) => {
          delete row[col];
        });
        return row;
      });

      // 필터링된 결과 반환
      return res.status(200).send(filteredResult);
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  })
  .put(async (req, res) => {
    let dbTable = "";
    let dbPK = "";

    // req.body에서 db 필드 처리
    if (req.body.db) {
      switch (req.body.db) {
        case "account":
          dbTable = "cm_user_t"; // DB 테이블 설정
          dbPK = "user_id"; // DB Primary Key
          break;
        case "post":
          dbTable = "cm_board_t";
          dbPK = "post_id"; // DB Primary Key
          break;
        default:
          return res.status(400).send("Invalid db parameter");
      }
    } else {
      return res.status(400).send("Missing db parameter");
    }

    // req.body.data가 배열인지 확인하고 처리
    if (Array.isArray(req.body.data)) {
      try {
        for (const item of req.body.data) {
          let count = 0;
          let values = [];
          let setConditions = [];
          let whereConditions = [];

          // item이 객체인지 확인
          if (typeof item === "object" && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
              count += 1;
              values.push(value); // 값을 values 배열에 추가

              if (key === dbPK) {
                // user_id는 WHERE 절에 사용
                whereConditions.push(`${key} = $${count}`);
              } else {
                // 그 외의 필드는 SET 절에 사용
                setConditions.push(`${key} = $${count}`);
              }
            });

            // SQL 쿼리 실행
            if (setConditions.length > 0 && whereConditions.length > 0) {
              const query = `UPDATE ${dbTable} SET ${setConditions.join(
                ", "
              )} WHERE ${whereConditions.join(" AND ")} RETURNING *`;

              const result = await pgSQL.query({
                text: query,
                values: values,
              });

              console.log("Updated row:", result.rows[0]);
            }
          }
        }

        // 모든 업데이트가 성공하면 응답 반환
        return res.status(200).send("All rows updated successfully");
      } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).send("Server Error");
      }
    } else {
      return res.status(400).send("Invalid data format");
    }
  })
  .delete(async (req, res) => {
    let dbTable = "";
    let conditions = [];
    let values = [];

    // req.query에서 db 필드 처리
    if (req.query.db) {
      switch (req.query.db) {
        case "account":
          dbTable = "cm_user_t"; // DB 테이블 설정
          break;
        case "post":
          dbTable = "cm_board_t";
          break;
        default:
          return res.status(400).send("Invalid db parameter");
      }
    } else {
      return res.status(400).send("Missing db parameter");
    }

    // req.query에서 조건 추출
    try {
      Object.entries(req.query).forEach(([key, value]) => {
        // db는 제외하고 조건 처리
        if (key !== "db") {
          conditions.push(`${key} = $${conditions.length + 1}`);
          values.push(value);
        }
      });

      const conditionClause = conditions.length
        ? "WHERE " + conditions.join(" AND ")
        : "";

      // SQL DELETE 쿼리 실행
      const result = await pgSQL.query({
        text: `DELETE FROM ${dbTable} ${conditionClause} RETURNING *`,
        values: values,
      });

      if (result.rowCount === 0) {
        return res.status(404).send("No items found matching the criteria");
      }

      // 삭제된 데이터 반환
      return res.status(200).send(result.rows[0]);
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).send("Server Error");
    }
  });

module.exports = router;
