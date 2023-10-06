module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  settings: {
    'import/resolver': {
      // Loads tsconfig from root
      typescript: {},
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // So we don't have to specify file extensions on this types
    'import/extensions': ['error', 'always', {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    // Ignore base rule for unused inputs in declarations,
    // allows us to have unused vars in type declarations
    'no-unused-vars': 0,
    // enums showing they have already been used
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    // Allow non default exports:
    'import/prefer-default-export': 'off',
    // importing from vitest for test dependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.test.tsx'] }],
  },
  // typescript definition for timer IDs
  globals: {
    NodeJS: true,
  },
};
