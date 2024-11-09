import { Global } from "@emotion/react";
import reset from "./reset";

const GlobalStyle = ({ children }) => {
  return (
    <>
      <Global styles={reset} />
      {children}
    </>
  );
};

export default GlobalStyle;
