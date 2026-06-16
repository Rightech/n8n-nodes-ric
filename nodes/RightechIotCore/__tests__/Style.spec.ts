import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';
import { expect, it } from 'vitest';

function getAllTsFiles(dir: string): string[] {
	const results: string[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...getAllTsFiles(full));
		} else if (entry.isFile() && full.endsWith('.ts') && !full.endsWith('.d.ts')) {
			results.push(full);
		}
	}
	return results;
}

const emojiRegex = /\p{Extended_Pictographic}/u;

function checkLegalString(text: string): boolean {
	return emojiRegex.test(text);
}

function unescapeJsString(raw: string): string {
	let result = '';
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (ch !== '\\') {
			result += ch;
			continue;
		}
		// handle backslash
		const next = raw[++i];
		if (next === undefined) {
			// trailing backslash – treat as literal backslash (should not happen in valid code)
			result += '\\';
			break;
		}
		switch (next) {
			case 'n':
				result += '\n';
				break;
			case 't':
				result += '\t';
				break;
			case 'r':
				result += '\r';
				break;
			case 'b':
				result += '\b';
				break;
			case 'f':
				result += '\f';
				break;
			case 'v':
				result += '\v';
				break;
			case '0':
				result += '\0';
				break;
			case '\\':
				result += '\\';
				break;
			case "'":
				result += "'";
				break;
			case '"':
				result += '"';
				break;
			case '`':
				result += '`';
				break;
			case 'x': {
				// \xNN – two hex digits
				const hex = raw.substr(i + 1, 2);
				result += String.fromCharCode(parseInt(hex, 16));
				i += 2;
				break;
			}
			case 'u': {
				// \uNNNN or \u{...}
				if (raw[i + 1] === '{') {
					const close = raw.indexOf('}', i + 2);
					const hex = raw.slice(i + 2, close);
					result += String.fromCodePoint(parseInt(hex, 16));
					i = close;
				} else {
					const hex = raw.substr(i + 1, 4);
					result += String.fromCharCode(parseInt(hex, 16));
					i += 4;
				}
				break;
			}
			default:
				// In JS, a backslash before a non‑special character is just the character itself
				result += next;
				break;
		}
	}
	return result;
}

function findIllegalStrings(filePath: string): string[] {
	const sourceCode = fs.readFileSync(filePath, 'utf8');
	const sourceFile = ts.createSourceFile(
		filePath,
		sourceCode,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);

	const violations: string[] = [];

	function reportViolation(node: ts.Node, unescapedText: string) {
		const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
		violations.push(
			`${filePath}:${line + 1}:${character + 1} - forbidden Unicode in string: "${unescapedText}"`,
		);
	}

	function checkLiteral(text: string, node: ts.Node) {
		const unescaped = unescapeJsString(text);
		if (checkLegalString(unescaped)) {
			reportViolation(node, unescaped);
		}
	}

	function visit(node: ts.Node) {
		// Plain string literals (single or double quoted)
		if (ts.isStringLiteral(node)) {
			const raw = node.getText(sourceFile); // includes quotes
			const inner = raw.slice(1, -1); // remove enclosing quotes
			checkLiteral(inner, node);
		}

		// NoSubstitutionTemplateLiteral: `...` without expressions
		if (ts.isNoSubstitutionTemplateLiteral(node)) {
			const raw = node.getText(sourceFile); // includes backticks
			const inner = raw.slice(1, -1);
			checkLiteral(inner, node);
		}

		if (ts.isTemplateExpression(node)) {
			const head = node.head;
			checkLiteral(head.getText(sourceFile).slice(1, -2), head);

			// spans (middle + tail)
			for (const span of node.templateSpans) {
				const literal = span.literal;
				const raw = literal.getText(sourceFile);
				if (ts.isTemplateMiddle(literal)) {
					// Text between } and ${, ending with }$
					// Remove leading '}' and trailing '${'
					checkLiteral(raw.slice(1, -2), literal);
				} else if (ts.isTemplateTail(literal)) {
					// Last part: } and closing backtick
					// Remove leading '}' and trailing '`'
					checkLiteral(raw.slice(1, -1), literal);
				}
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return violations;
}

it('No emoji or icons are allowed string literals per n8n style guides', () => {
	// actually guides focus on UI elements like names, descriptions etc., but that is much more complicated to check
	// and currently there is no other legitimate uses for static iconography
	// importantly dynamic content is exempt from this rule, so checking just sources is fine
	const testFiles = getAllTsFiles(path.resolve(__dirname));
	const codeFiles = getAllTsFiles(path.resolve(__dirname, '..')).filter(
		(item) => !testFiles.includes(item),
	);
	const violations: string[] = codeFiles.flatMap((file) => [...findIllegalStrings(file)]);
	expect(violations).toEqual([]);
});
