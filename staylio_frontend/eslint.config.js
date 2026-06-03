import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
