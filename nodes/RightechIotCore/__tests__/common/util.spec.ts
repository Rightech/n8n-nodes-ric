import { expect, it } from 'vitest';
import { parseContentDispositionFileName, timezoneNameToOffset } from '../../common/util.js';

it('parseContentDispositionFileName', () => {
	expect(parseContentDispositionFileName('filename="example.txt"')).toEqual('example.txt');
	expect(parseContentDispositionFileName('attachment; filename="example.txt"')).toEqual(
		'example.txt',
	);
	expect(parseContentDispositionFileName("filename*=UTF-8''na%C3%AFve%20file.txt")).toEqual(
		'naïve file.txt',
	);
	expect(
		parseContentDispositionFileName("attachment; filename*=UTF-8''na%C3%AFve%20file.txt"),
	).toEqual('naïve file.txt');
});

it('timezoneNameToOffset', () => {
	expect(timezoneNameToOffset('Europe/Moscow')).toEqual(-180);
	expect(timezoneNameToOffset('America/New_York')).toEqual(240);
});
