import * as assert from 'assert';
import { interpolateTemplate, padNumber, generateSeparator } from '../../utils/string-utils';

suite('String Utils Test Suite', () => {
    test('should interpolate template strings correctly', () => {
        const result = interpolateTemplate('Hello, ${name}!', { name: 'World' });
        assert.strictEqual(result, 'Hello, World!');
    });

    test('should pad numbers correctly', () => {
        const result = padNumber(5, 3);
        assert.strictEqual(result, '005');
    });

    test('should generate separators correctly', () => {
        const result = generateSeparator('-', 10);
        assert.strictEqual(result, '----------');
    });
});