import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "react/react-in-jsx-scope": "off", // 이 규칙을 비활성화
    },
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
