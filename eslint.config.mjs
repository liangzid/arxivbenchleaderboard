import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),
  js.configs.recommended,
  {
    rules: {
      // Core rules
      "no-unused-vars": "off", // Disable base rule in favor of TS version
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // TypeScript-specific rules
      "@typescript-eslint/no-explicit-any": "warn", // Make 'any' warnings instead of errors
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      
      // React-specific rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      
      // Best practices
      "prefer-rest-params": "error",
      
      // Customize based on your needs
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { "prefer": "type-imports", "disallowTypeAnnotations": false }
      ]
    }
  },
  {
    // Apply to TypeScript files only
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          "allowExpressions": true,
          "allowTypedFunctionExpressions": true
        }
      ]
    }
  }
];