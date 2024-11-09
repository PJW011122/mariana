/*
 * 작성자: 박준우
 * 작성일: 24.08.07
 * 설명: server.js의 가독성을 향상시키위해 router 파트 분리
 * 부모 연결: server.js
 * 자식 연결: class* , api_*
 */
const router = require("express").Router();

// 연결 페이지 설정
const classB_File = require("./classB_File");
const api_Board = require("../api/api_Board.js");
const api_Signin = require("../api/api_Signin.js");
const api_Signup = require("../api/api_Signup.js");
const api_Level = require("../api/api_Level.js");
const api_Like = require("../api/api_Like.js");

router.use("/file", classB_File);
router.use("/board", api_Board);
router.use("/signin", api_Signin);
router.use("/signup", api_Signup);
router.use("/level", api_Level);
router.use("/like", api_Like);

module.exports = router;
