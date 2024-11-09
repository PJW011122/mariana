/*
 * 작성자:
 * 작성일:
 * 설명: 한글 깨지는 이슈 때문에 Base64 인코딩 해서 보관
 * 부모 연결:
 * 자식 연결:
 */

export const encode = (filename) => {
  // URI 인코딩 후 Base64 인코딩
  return btoa(encodeURIComponent(filename));
};

export const decode = (base64) => {
  // Base64 디코딩 후 URI 디코딩
  return decodeURIComponent(atob(base64));
};
