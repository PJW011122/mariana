/*
 * 작성자:
 * 작성일:
 * 설명:
 * 부모 연결:
 * 자식 연결:
 */
const router = require("express").Router();

// 연결 페이지 설정
const api_File = require("../api/api_File");
const api_FileUp = require("../api/api_FileUp");
const api_FileDown = require("../api/api_FileDown");

router.use("/", api_File);
router.use("/upload", api_FileUp);
router.use("/download", api_FileDown);

module.exports = router;
