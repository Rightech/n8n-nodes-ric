import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		tsconfig: './tsconfig.test.json',
		expect: {
			requireAssertions: true,
		},
		coverage: {
			provider: 'v8',
			include: ['nodes/**/*.{ts,tsx}', 'credentials/**/*.{ts,tsx}'],
			exclude: ['**/__tests__/**'],
		},
	},
});
