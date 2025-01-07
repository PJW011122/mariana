const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const officialDir = "/data/official";

// 파일 저장 위치 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, officialDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름에 타임스탬프 추가
  },
});
const upload = multer({ storage: storage });

// 파일 업로드 엔드포인트
router.route("/").post(upload.single("file"), async (req, res) => {
  try {
    // 파일 업로드 성공 응답
    return res.status(200).json({
      message: "파일 업로드 성공",
      file: req.file, // 파일 정보 반환
    });
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    res.status(500).json({ message: "파일 업로드 실패", error });
  }
});

module.exports = router;
