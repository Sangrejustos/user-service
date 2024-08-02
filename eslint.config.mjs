import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
    },
    { languageOptions: { globals: globals.node } },
    {
        ignores: [
            '**/*.spec.ts',
            '**/*.pipe.ts',
            '**/*.e2e-spec.ts',
            'dist',
            'node_modules',
        ],
    },
];
