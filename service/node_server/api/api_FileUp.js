const router = require("express").Router();
const multer = require("multer");
const fsPromise = require("fs").promises;
const path = require("path");
const toGeoJson = require("@tmcw/togeojson");
const { emitWarning } = require("process");
const DOMParser = require("@xmldom/xmldom").DOMParser;

// 현재 파일이 있는 디렉토리 경로 (__dirname)
const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
const geojsonDir = path.join(__dirname, '..', 'uploads', 'geojson');

// 파일 저장 위치 및 파일 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.route("/").post(upload.single("file"), async (req, res) => {
  try {
    const { file } = req;
    const filePath = path.join(tempDir, file.filename);
    const fileExt = path.extname(file.filename).toLowerCase();

    let geojson;

    // GPX, KML, TCX 파일을 GeoJSON으로 변환
    if (fileExt === ".gpx" || fileExt === ".kml" || fileExt === ".tcx") {
      const xmlData = await fsPromise.readFile(filePath, "utf8");

      // XML 데이터를 DOM으로 파싱
      const dom = new DOMParser().parseFromString(xmlData, "text/xml");

      if (fileExt === ".gpx") {
        geojson = toGeoJson.gpx(dom);
      } else if (fileExt === ".kml") {
        geojson = toGeoJson.kml(dom);
      } else if (fileExt === ".tcx") {
        geojson = toGeoJson.tcx(dom);
      }

      const geojsonFileName = `${path.basename(file.filename, fileExt)}.geojson`;
      const geojsonFilePath = path.join(geojsonDir, geojsonFileName);

      // 변환된 GeoJSON 파일 저장
      await fsPromise.writeFile(geojsonFilePath, JSON.stringify(geojson));

      return res.status(200).json({
        message: "파일 업로드 및 변환 성공",
        file: req.file,
      });
    } else {
      // 파일이 지원되지 않는 형식인 경우 에러 반환
      return res.status(200).json({ message: "파일 업로드 성공", file: req.file });
    }
  } catch (error) {
    console.error("파일 업로드 및 변환 실패:", error);
    res.status(500).json({ message: "파일 업로드 및 변환 실패", error });
  }
});

module.exports = router;
