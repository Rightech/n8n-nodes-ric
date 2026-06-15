import { config } from '@n8n/node-cli/eslint';

export default [
    ...config,
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/__tests__/**',
            '**/coverage/**',
            'vitest.config.ts',
            'vitest.setup.ts',
        ],
    },
];
