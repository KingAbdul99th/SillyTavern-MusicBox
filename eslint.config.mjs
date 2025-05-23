// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
// Note the `/flat` suffix here, the difference from default entry is that
// `/flat` added `name` property to the exported object to improve
// [config-inspector](https://eslint.org/blog/2024/04/eslint-config-inspector/) experience.
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier
);
