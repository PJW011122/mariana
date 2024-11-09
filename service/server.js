// 환경변수 선언
require("dotenv").config();

// 서버 개방
const express = require("express"); // express 프레임워크 객체 생성
const app = express(); // express의 새 인스턴스 할당
const cookieParser = require("cookie-parser");

// ajax 기초 설정 (CORS 조치)
const cors = require("cors");
const corsOptions = {
  origin: process.env.CORS, // 클라이언트 도메인
  credentials: true, // 쿠키를 포함한 요청을 허용
};
app.use(cors(corsOptions));

// 쿠키 파서 미들웨어
app.use(cookieParser());
// React.js와 연결 (react에서 build한 index.html file 받아옴)
// const path = require("path");
// app.use(express.static(path.resolve(__dirname, "./react_client/build")));
// 해당 처리 없으면 index.html 못읽음
// 241102 Nginx로 서빙하기 때문에 백엔드에서 직접 불러오지 않아도 됨

app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// postgreSQL과 연결
const pgSQL = require("./postgres_db/index.js");
pgSQL
    .connect()
    .then(() => {
      console.log("server ::: pgSQL connected");
    })
    .catch((err) => {
      console.log("server ::: pgSQL Failed: " + err.message);
    });

// 동작 확인 (health check endpoint - 쿠버네티스 연결 테스트)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 라우터 처리
const route = require("./node_server/route/classA.js");
app.use("/", route);

// 라우터를 원활하게 사용하기 위한 추가 처리
// 241102 Nginx로 서빙하고 있기 때문에 백엔드에서 직접 불러오지 않음
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./react_client/build/index.html"));
// });
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./react_client/build/index.html"));
// });

const PORT = process.env.NODE_DOCKER_PORT || 5000;
app.listen(PORT, function () {
  console.log(`server ::: Node+Express Connect on ${PORT}`);
});
