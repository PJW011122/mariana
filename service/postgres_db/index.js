/*
 * 작성자: 박준우
 * 작성일: 240807
 * 설명: db와 server 연결
*/

const dbConfig = require("./config.js");

// postgresSQL과 node.js 연결
const { Pool } = require("pg"); //postgresSQL을 Pool 객체에 담음
const pgSQL = new Pool({
  //postgresSQL DB정보 입력
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  database: dbConfig.DB,
});

module.exports = pgSQL;










/*
 * 박준우 / 240807
 * Sequelize의 필요성에 대해 잘모르겠음 
 * 따라서 해당 연결 방식은 보류

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, 
                                dbConfig.USER, 
                                dbConfig.PASSWORD, 
                                {
                                  host: dbConfig.HOST,
                                  dialect: dbConfig.dialect,

                                  pool: {
                                    max: dbConfig.pool.max,
                                    min: dbConfig.pool.min,
                                    acquire: dbConfig.pool.acquire,
                                    idle: dbConfig.pool.idle,
                                  },
                                });

const pgSQL = {};

pgSQL.Sequelize = Sequelize;
pgSQL.sequelize = sequelize;

module.exports = pgSQL;
*/