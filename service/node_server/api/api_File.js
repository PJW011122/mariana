const router = require("express").Router();
const fs = require("fs");
const fsPromise = fs.promises;
const path = require("path");
const pgSQL = require("../../postgres_db/index");

// 현재 파일이 있는 디렉토리 경로 (__dirname)
const tempDir = path.join(__dirname, "..", "uploads", "temp");
const officialDir = path.join(__dirname, "..", "uploads", "official");
const geojsonDir = path.join(__dirname, "..", "uploads", "geojson");

// 파일 존재 여부 확인 및 삭제 함수
async function deleteFile(filePath) {
  try {
    await fsPromise.access(filePath);
    await fsPromise.unlink(filePath);
    console.log("api_FIle ::: deleteFile - 삭제 성공:", filePath);
  } catch (err) {
    console.error("api_FIle ::: deleteFile - 삭제 실패:", err);
    throw err;
  }
}

// geojson 파일 목록 조회
router.get("/", async (req, res) => {
  try {
    const selectResult = await pgSQL.query({
      text: `SELECT * FROM cm_file_t WHERE post_file = $1`,
      values: [req.query.post_file],
    });
    return res.status(200).send(selectResult);
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).send("Server Error");
  }
});

// 파일 삭제
router.delete("/", async (req, res) => {
  const fileName = req.query.fileName;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: "파일 이름이 제공되지 않았습니다." });
  }
  const fileExt = path.extname(fileName).toLowerCase();
  const tempFilePath = path.resolve(tempDir, fileName);
  const officialFilePath = path.resolve(officialDir, fileName);
  const geojsonFileName = `${path.basename(fileName, fileExt)}.geojson`;
  const geojsonFilePath = path.join(geojsonDir, geojsonFileName);

  try {
    fs.stat(geojsonFilePath, async (err, stats) => {
      if (err) {
      } else {
        await deleteFile(geojsonFilePath);
      }
    });
    fs.stat(tempFilePath, async (err, stats) => {
      if (err) {
      } else {
        await deleteFile(tempFilePath);
      }
    });
    fs.stat(officialFilePath, async (err, stats) => {
      if (err) {
      } else {
        await deleteFile(officialFilePath); //실제 파일 삭제

        //파일 로그(db) 삭제 ... onDelete Cascade로 처리하기 때문에 필요x
      }
    });
    res.status(200).json({ message: "전체 파일 삭제 성공." });
  } catch (err) {
    res.status(500).json({ message: "전체 파일 삭제 실패.", error: err });
  }
});

module.exports = router;
