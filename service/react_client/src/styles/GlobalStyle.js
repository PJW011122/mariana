import { Global } from "@emotion/react";
import reset from "./reset";

const GlobalStyle = () => {
  return (
    <>
      <Global styles={reset} />
    </>
  );
};

export default GlobalStyle;
