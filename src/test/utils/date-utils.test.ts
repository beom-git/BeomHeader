import * as assert from 'assert';
import { getTodayFormatted, getCurrentTimestamp, getCurrentYear, formatDate, isValidYear } from '../../utils/date-utils';

suite('Date Utils Test Suite', () => {
    test('should get today formatted as YYYY/MM/DD', () => {
        const today = getTodayFormatted();
        const pattern = /^\d{4}\/\d{2}\/\d{2}$/;
        assert.ok(pattern.test(today), 'Today should match YYYY/MM/DD format');
    });

    test('should get current timestamp', () => {
        const timestamp = getCurrentTimestamp();
        const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        assert.ok(pattern.test(timestamp), 'Timestamp should match YYYY-MM-DD HH:MM:SS format');
    });

    test('should get current year as string', () => {
        const year = getCurrentYear();
        const currentYear = new Date().getFullYear();
        assert.strictEqual(year, currentYear.toString());
    });

    test('should format date according to pattern', () => {
        const date = new Date(2023, 8, 15, 14, 30, 45); // September 15, 2023, 14:30:45
        const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
        assert.strictEqual(formatted, '2023-09-15 14:30:45');
    });

    test('should validate year correctly', () => {
        assert.ok(isValidYear('2023'));
        assert.ok(!isValidYear('1899'));
        assert.ok(!isValidYear('invalid'));
        assert.ok(!isValidYear('3000'));
    });
});
