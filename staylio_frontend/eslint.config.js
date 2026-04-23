import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: [
          "./admin/tsconfig.json",
          "./client/tsconfig.json"
        ],
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
];