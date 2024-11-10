/*
 * 작성자: 박준우
 * 작성일: 240807
 * 설명: postgreSQL의 기본 정보에 대한 기술
 * 부모 연결: server.js
 * 자식 연결: ./index.js
*/

//환경 변수 설정
require("dotenv").config();

module.exports = {
  //postgres 연결 파트
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_LOCAL_PORT,
  DB: process.env.DB_DATABASE,
  dialect: "postgres",

  // //sequelize connection pool 설정 파트
  // pool: {
  //   max: 5,         //풀의 최대 연결 수
  //   min: 0,         //풀의 최소 연결 수 
  //   acquire: 30000, //오류가 발생하기 전 해당 풀이 연결을 시도하는 최대 시간
  //   idle: 10000,    //연결이 해제되기 전 유휴 상태일 수 있는 최대 시간
  // },
};
