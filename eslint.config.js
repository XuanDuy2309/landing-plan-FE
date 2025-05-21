import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Các rule kiểm soát kiểu dữ liệu
      '@typescript-eslint/explicit-function-return-type': ['error'], // Bắt buộc hàm phải có kiểu trả về rõ ràng
      '@typescript-eslint/no-explicit-any': ['error'],               // Không cho phép dùng `any`
      '@typescript-eslint/explicit-module-boundary-types': ['error'],// Yêu cầu khai báo kiểu đầu vào và đầu ra
      '@typescript-eslint/no-inferrable-types': ['warn'],            // Cảnh báo nếu khai báo kiểu không cần thiết
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Bắt buộc dùng interface thay vì type alias
    },
  },
)
