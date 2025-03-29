// eslint.config.js (or .mjs if using "type": "module")
import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintPluginImport from "eslint-plugin-import";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  // ✅ Add your ignore patterns here
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/.vitepress/cache/**",
    "**/docs/.vitepress/cache/**",
    "**/*.d.ts",
    "**/*.js",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: eslintPluginImport,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Buffer: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "import/extensions": ["error", "always", {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      }],
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": ["error", {
            devDependencies: [
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.ts",
                "**/test/**",
                "**/tests/**",
                "**/*.config.ts",
                "**/vite.config.ts",
                "**/docs/**",
                "**/.vitepress/**",
            ],
        }],
    },
  },
  // For config files
  {
    files: ["**/.eslintrc.{js,cjs}"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "commonjs",
      globals: globals.node,
    },
  },

  // For Docs files
  {
    files: ["docs/**/*.{ts,tsx,js}"],
    settings: {
      "import/core-modules": ["vue", "vitepress"], // tell import plugin not to flag these
    },
    rules: {
      "import/no-extraneous-dependencies": "off", // or leave as-is if needed
    },
  }
  
]);
