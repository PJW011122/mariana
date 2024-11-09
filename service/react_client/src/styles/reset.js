import { css } from "@emotion/react";
import { typographies } from "./typhographies";

const reset = css`
  * {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
  }
  *,
  :after,
  :before {
    box-sizing: border-box;
  }
  :root {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    cursor: default;
    line-height: 1.5;
    overflow-wrap: break-word;
    -moz-tab-size: 4;
    tab-size: 4;
  }
  html,
  body {
    height: 100dvh;
    width: 100dvw;
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: #888888;
    overscroll-behavior: none;
    position: fixed;
    ${typographies.PretendardRegular};
    font-size: 16px;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }
  button {
    background: none;
    border: 0;
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  // Gothci-A1
  @font-face {
    font-family: "Gothic A1";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2205@1.0/GothicA1-Light.woff2")
      format("woff2");
    font-weight: 300;
    font-style: normal;
  }

  /* Neo 둥근모 Pro */
  @font-face {
    font-family: "Neo Dunggeunmo Pro";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/NeoDunggeunmoPro-Regular.woff2")
      format("woff2");
    font-weight: 400;
    font-style: normal;
  }

  /* 레페리 베이스 */
  @font-face {
    font-family: "Leferi Base";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/LeferiBaseType-RegularA.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Leferi Base";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/LeferiBaseType-BoldA.woff")
      format("woff");
    font-weight: 700;
    font-style: normal;
  }

  /* Neo 둥근모 Pro */
  @font-face {
    font-family: "DOSGothic";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_eight@1.0/DOSGothic.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
      format("woff");
    font-weight: 400;
    font-style: normal;
  }
`;

export default reset;
