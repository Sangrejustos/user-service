import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettier,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
    },
    { languageOptions: { globals: globals.node } },
    {
        ignores: ['**/*.spec.ts', '**/*.e2e-spec.ts', 'dist', 'node_modules'],
    },
];
