import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'next',
      'prettier',
      'plugin:@next/next/recommended',
      'eslint:recommended',
      'next/core-web-vitals',
    ],
    rules: {
      // remove use effect missing dependencies
      'react-hooks/exhaustive-deps': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    globals: {
      NodeJS: true,
    },
  }),
];

export default eslintConfig;
