import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export default async () => {
	const dir = join(tmpdir(), 'n8n-test');

	process.env.N8N_USER_FOLDER = dir;
	process.env.N8N_ENCRYPTION_KEY = 'test_key';

	await mkdir(join(dir, '.n8n'), { recursive: true });

	// n8n lib creates a default config in /home/node/.n8n/config which is bad for testing
	// but it also sometimes creates it too late leading to flaky tests
	await writeFile(
		join(dir, '.n8n', 'config'),
		JSON.stringify({
			encryptionKey: 'test_key',
			instanceId: 'test',
		}),
		'utf8',
	);
};
