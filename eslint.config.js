import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.next', 'next-env.d.ts']),
  nextPlugin.flatConfig.recommended,
  nextPlugin.flatConfig.coreWebVitals,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Detectar type assertions inseguras. Permitir `as const` (literal types)
      // y casts a `unknown` (forzamos narrowing explícito después).
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'TSAsExpression[typeAnnotation.typeName.type="TSAsExpression"] > TSAsExpression',
          message: 'Evitar type assertions anidadas. Usá un type guard o unknown + narrowing.',
        },
        {
          selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
          message: 'No uses `as any`. Resolvelo con un type guard o unknown.',
        },
      ],
    },
  },
])
