//----// File Name     : date-utils.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 01:25:00 UTC (by root)--------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : date-utils.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for date-utils module
//        o Timestamp generation with timezone support
//        o Date formatting
//        o Year validation
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import {
  getTodayFormatted,
  getCurrentTimestamp,
  getCurrentYear,
  formatDate,
  isValidYear
} from '../../utils/date-utils';
import { assertValidDateString } from '../test-setup';

describe('date-utils', () => {
  describe('getCurrentTimestamp', () => {
    it('should generate timestamp in YYYY-MM-DD HH:MM:SS format', () => {
      const timestamp = getCurrentTimestamp();
      assertValidDateString(timestamp, 'YYYY-MM-DD HH:MM:SS');
    });

    it('should generate timestamp with default UTC timezone', () => {
      const timestamp = getCurrentTimestamp();
      expect(timestamp).to.be.a('string');
      expect(timestamp.length).to.equal(19); // YYYY-MM-DD HH:MM:SS
    });

    it('should accept optional timezone parameter', () => {
      const utcTimestamp = getCurrentTimestamp('UTC');
      const seoulTimestamp = getCurrentTimestamp('Asia/Seoul');
      
      expect(utcTimestamp).to.be.a('string');
      expect(seoulTimestamp).to.be.a('string');
      // Both should be valid timestamps
      assertValidDateString(utcTimestamp);
      assertValidDateString(seoulTimestamp);
    });

    it('should handle different timezones correctly', () => {
      const timezones = ['UTC', 'Asia/Seoul', 'Europe/London', 'America/New_York'];
      
      timezones.forEach(tz => {
        const timestamp = getCurrentTimestamp(tz);
        assertValidDateString(timestamp);
      });
    });

    it('should return current time components', () => {
      const timestamp = getCurrentTimestamp();
      const [date, time] = timestamp.split(' ');
      const [year, month, day] = date.split('-');
      const [hours, minutes, seconds] = time.split(':');

      expect(parseInt(year)).to.be.at.least(2023);
      expect(parseInt(month)).to.be.within(1, 12);
      expect(parseInt(day)).to.be.within(1, 31);
      expect(parseInt(hours)).to.be.within(0, 23);
      expect(parseInt(minutes)).to.be.within(0, 59);
      expect(parseInt(seconds)).to.be.within(0, 59);
    });
  });

  describe('getTodayFormatted', () => {
    it('should generate date in YYYY/MM/DD format', () => {
      const today = getTodayFormatted();
      assertValidDateString(today, 'YYYY/MM/DD');
    });

    it('should accept optional timezone parameter', () => {
      const utcToday = getTodayFormatted('UTC');
      const seoulToday = getTodayFormatted('Asia/Seoul');

      assertValidDateString(utcToday, 'YYYY/MM/DD');
      assertValidDateString(seoulToday, 'YYYY/MM/DD');
    });

    it('should contain valid date components', () => {
      const today = getTodayFormatted();
      const [year, month, day] = today.split('/');

      expect(parseInt(year)).to.be.at.least(2023);
      expect(parseInt(month)).to.be.within(1, 12);
      expect(parseInt(day)).to.be.within(1, 31);
    });
  });

  describe('getCurrentYear', () => {
    it('should return current year as string', () => {
      const year = getCurrentYear();
      expect(year).to.be.a('string');
      expect(year).to.match(/^\d{4}$/);
    });

    it('should return 4-digit year', () => {
      const year = getCurrentYear();
      const yearNum = parseInt(year);
      expect(yearNum).to.be.at.least(2023);
      expect(yearNum).to.be.at.most(new Date().getFullYear() + 1);
    });
  });

  describe('formatDate', () => {
    it('should format date with YYYY pattern', () => {
      const date = new Date('2025-11-07T12:34:56');
      const formatted = formatDate(date, 'YYYY');
      expect(formatted).to.equal('2025');
    });

    it('should format date with YYYY-MM-DD pattern', () => {
      const date = new Date('2025-11-07T12:34:56');
      const formatted = formatDate(date, 'YYYY-MM-DD');
      expect(formatted).to.equal('2025-11-07');
    });

    it('should format date with full timestamp pattern', () => {
      const date = new Date('2025-11-07T12:34:56');
      const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss');
      expect(formatted).to.match(/2025-11-07 \d{2}:\d{2}:\d{2}/);
    });

    it('should handle multiple pattern replacements', () => {
      const date = new Date('2025-11-07T09:05:03');
      const formatted = formatDate(date, '[YYYY/MM/DD HH:mm:ss]');
      expect(formatted).to.match(/\[2025\/11\/07 \d{2}:\d{2}:\d{2}\]/);
    });
  });

  describe('isValidYear', () => {
    it('should accept valid years', () => {
      expect(isValidYear('2023')).to.be.true;
      expect(isValidYear('2024')).to.be.true;
      expect(isValidYear('2025')).to.be.true;
      expect(isValidYear('1990')).to.be.true;
    });

    it('should reject invalid years', () => {
      expect(isValidYear('1800')).to.be.false;
      expect(isValidYear('1899')).to.be.false;
      expect(isValidYear((new Date().getFullYear() + 11).toString())).to.be.false;
    });

    it('should reject non-numeric strings', () => {
      expect(isValidYear('abc')).to.be.false;
      expect(isValidYear('')).to.be.false;
      expect(isValidYear('20-25')).to.be.false;
    });

    it('should reject edge cases', () => {
      expect(isValidYear('NaN')).to.be.false;
      expect(isValidYear('undefined')).to.be.false;
    });
  });
});

