const router = require("express").Router();
const fsPromise = require("fs").promises;
const path = require("path");
const pgSQL = require("../../postgres_db/index");
const { uuid } = require("../util/generateKey");

// 현재 파일이 있는 디렉토리 경로 (__dirname)
const currentDir = __dirname;
const parentDir = path.join(currentDir, "..");
const tempDir = path.join(parentDir, "/uploads/temp");
const officialDir = path.join(parentDir, "/uploads/official");

router.route("/move2temp").post(async (req, res) => {
  // SQL 구성 (cm_board_t와 연결된 파일이 있는지 조회)
  let conditions = [];
  let values = [];
  Object.entries(req.body).forEach(([key, value]) => {
    conditions.push(`${key} = $${conditions.length + 1}`);
    values.push(value);
  });
  const conditionClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  try {
    const selectResult = await pgSQL.query({
      text: `SELECT * FROM cm_file_t ${conditionClause}`,
      values: values,
    });

    if (selectResult.rowCount > 0) {
      // 파일 이동 작업을 비동기적으로 처리
      await Promise.all(
        selectResult.rows.map(async (row) => {
          const officialPath = path.join(officialDir, row.file_path);
          const tempPath = path.join(tempDir, row.file_path);

          try {
            // official->temp 파일 이동
            await fsPromise.rename(officialPath, tempPath);
          } catch (err) {
            console.error("파일 이동 오류:", err);
            return res.status(500).send("파일 이동 오류");
          }
        })
      );
    }
    res.status(200).send(selectResult); // 성공 응답
  } catch (error) {
    console.error("파일 조회 오류:", error);
    res.status(500).send("파일 조회 오류");
  }
});
router.route("/move2official").post(async (req, res) => {
  const fileName = req.body.file_path;
  const officialPath = path.join(officialDir, fileName);
  const tempPath = path.join(tempDir, fileName);
  try {
    // temp->official 파일 이동
    await fsPromise.rename(tempPath, officialPath);
    res.status(200).send("파일이 성공적으로 이동되었습니다.");
  } catch (err) {
    console.error("파일 이동 오류:", err);
    if (!res.headersSent) {
      res.status(500).send("파일 이동 오류");
    }
  }
  // 신규 입력이라면 파일 정보 db에 입력
  if (!req.body.file_id) {
    let conditions = [];
    let conditions2 = [];
    let values = [];
    conditions.push("file_id");
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
        text: `INSERT INTO cm_file_t ${conditionClause}`,
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
  }
});
router.route("/copy2temp").post(async (req, res) => {
  // SQL 구성 (cm_board_t와 연결된 파일이 있는지 조회)
  let conditions = [];
  let values = [];
  Object.entries(req.body).forEach(([key, value]) => {
    conditions.push(`${key} = $${conditions.length + 1}`);
    values.push(value);
  });
  const conditionClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  try {
    const selectResult = await pgSQL.query({
      text: `SELECT * FROM cm_file_t ${conditionClause}`,
      values: values,
    });

    if (selectResult.rowCount > 0) {
      // 파일 이동 작업을 비동기적으로 처리
      await Promise.all(
        selectResult.rows.map(async (row) => {
          const officialPath = path.join(officialDir, row.file_path);
          const tempPath = path.join(tempDir, row.file_path);

          try {
            // 파일이 존재한다면 official에서 temp로 복사
            await fsPromise.copyFile(officialPath, tempPath);
          } catch (err) {
            console.error("파일 이동 오류:", err);
            return res.status(500).send("파일 이동 오류");
          }
        })
      );
    }
    res.status(200).send(selectResult); // 성공 응답
  } catch (error) {
    console.error("파일 조회 오류:", error);
    res.status(500).send("파일 조회 오류");
  }
});
router.route("/copy2official").post(async (req, res) => {
  const fileName = req.body.file_path;
  const tempPath = path.join(tempDir, fileName);
  try {
    // temp 파일 삭제
    await fsPromise.unlink(tempPath);
    res.status(200).send("파일이 성공적으로 이동되었습니다.");
  } catch (err) {
    console.error("파일 이동 오류:", err);
    if (!res.headersSent) {
      res.status(500).send("파일 이동 오류");
    }
  }
  // 신규 입력이라면 파일 정보 db에 입력
  if (!req.body.file_id) {
    let conditions = [];
    let conditions2 = [];
    let values = [];
    conditions.push("file_id");
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
        text: `INSERT INTO cm_file_t ${conditionClause}`,
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
  }
});

module.exports = router;
