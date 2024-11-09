/*
 * 작성자: 
 * 작성일: 
 * 설명: string 형태의 인덱싱을 개선하기 위해 약간의 변경
        (Storing UUID Values in MySQL / www.percona.com 참고)
 * 부모 연결: 
 * 자식 연결: 
*/

const { v4 } = require('uuid');

exports.uuid = () => {
    const uuid = v4();
    const tokens = uuid.split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]
}