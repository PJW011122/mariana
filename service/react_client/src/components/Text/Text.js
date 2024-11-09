import { css } from "@emotion/react";
import { typographies } from "../../styles/typhographies";
import { colors } from "../../styles/colors";

const Text = ({
  label,
  color,
  typography,
  weight,
  size,
  align = "center",
  wordBreak = "keep-all",
  ...props
}) => {
  return (
    <div
      css={css`
        color: ${colors[color]};
        ${typographies[typography]};
        font-weight: ${weight};
        white-space: pre-line;
        font-size: ${size}px;
        word-break: ${wordBreak};
        text-align: ${align};
      `}
      {...props}
    >
      {label}
    </div>
  );
};

export default Text;
