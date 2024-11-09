const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// 현재 파일이 있는 디렉토리 경로 (__dirname)
const officialDir = path.join(__dirname, "..", "uploads", "official");

router.route("/").get((req, res) => {
  console.log("sfdasdfasdfasdfasdf");
  const { fileName } = req.query;
  const filePath = path.join(officialDir, fileName);

  console.log("fileDownload", filePath, fileName);

  // 파일 존재 여부 확인
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("파일을 찾을 수 없습니다:", err);
      return res.status(404).send("파일을 찾을 수 없습니다.");
    }

    // 파일의 MIME 타입 가져오기
    const mimeType = mime.lookup(filePath) || "image/jpeg";

    // 응답 헤더 설정
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // 파일을 응답으로 전송
    fs.createReadStream(filePath).pipe(res);
  });
});

module.exports = router;
