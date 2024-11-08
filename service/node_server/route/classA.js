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
const api_Signin = require("../api/api_Signin");
const api_Signup = require("../api/api_Signup");
const api_Signout = require("../api/api_Signout");
const api_Auth = require("../api/api_Auth");
const api_Board = require("../api/api_Board.js");
const api_Comment = require("../api/api_Comment.js");
const api_Manage = require("../api/api_Manage.js");
const api_Vworld = require("../api/api_Vworld.js");

router.use("/file", classB_File);
router.use("/signin", api_Signin);
router.use("/signup", api_Signup);
router.use("/signout", api_Signout);
router.use("/auth", api_Auth);
router.use("/board", api_Board);
router.use("/comment", api_Comment);
router.use("/manage", api_Manage);
router.use("/vworld", api_Vworld);

module.exports = router;
