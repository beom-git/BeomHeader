//----// File Name     : string-utils.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 01:30:00 UTC (by root)--------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : string-utils.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for string-utils module
//        o String manipulation utilities
//        o Formatting and interpolation
//        o Validation helpers
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import {
  padNumber,
  interpolateTemplate,
  generateSeparator,
  isValidEmail,
  isValidUrl,
  isValidIdentifier,
  escapeRegex
} from '../../utils/string-utils';

describe('string-utils', () => {
  describe('padNumber', () => {
    it('should pad single digit numbers with leading zero', () => {
      expect(padNumber(1, 2)).to.equal('01');
      expect(padNumber(5, 2)).to.equal('05');
      expect(padNumber(9, 2)).to.equal('09');
    });

    it('should not change double digit numbers', () => {
      expect(padNumber(10, 2)).to.equal('10');
      expect(padNumber(99, 2)).to.equal('99');
    });

    it('should handle numbers larger than 99', () => {
      expect(padNumber(100, 2)).to.equal('100');
      expect(padNumber(999, 2)).to.equal('999');
    });

    it('should use custom padding width', () => {
      expect(padNumber(5, 3)).to.equal('005');
      expect(padNumber(12, 4)).to.equal('0012');
    });

    it('should handle zero', () => {
      expect(padNumber(0, 2)).to.equal('00');
      expect(padNumber(0, 3)).to.equal('000');
    });
  });

  describe('interpolateTemplate', () => {
    it('should replace simple placeholders', () => {
      const template = 'Hello, ${name}!';
      const result = interpolateTemplate(template, { name: 'Alice' });
      expect(result).to.equal('Hello, Alice!');
    });

    it('should handle multiple placeholders', () => {
      const template = '${greeting}, ${name}! Your age is ${age}.';
      const variables = { greeting: 'Hi', name: 'Bob', age: '25' };
      expect(interpolateTemplate(template, variables)).to.equal('Hi, Bob! Your age is 25.');
    });

    it('should handle repeated placeholders', () => {
      const template = '${name} meets ${name}';
      const result = interpolateTemplate(template, { name: 'Alice' });
      expect(result).to.equal('Alice meets Alice');
    });

    it('should leave unmapped placeholders as empty', () => {
      const template = 'Hello, ${name}! ${unknown}';
      const result = interpolateTemplate(template, { name: 'Charlie' });
      expect(result).to.equal('Hello, Charlie! ');
    });

    it('should handle empty template', () => {
      expect(interpolateTemplate('', {})).to.equal('');
    });

    it('should handle special characters in values', () => {
      const template = 'Path: ${path}';
      const result = interpolateTemplate(template, { path: '/home/user/file.ts' });
      expect(result).to.equal('Path: /home/user/file.ts');
    });

    it('should handle empty variables object', () => {
      const template = 'Hello ${name}';
      const result = interpolateTemplate(template, {});
      expect(result).to.equal('Hello ');
    });
  });

  describe('generateSeparator', () => {
    it('should generate separator with specified character and length', () => {
      expect(generateSeparator('-', 5)).to.equal('-----');
      expect(generateSeparator('=', 3)).to.equal('===');
    });

    it('should handle single character', () => {
      expect(generateSeparator('*', 1)).to.equal('*');
    });

    it('should handle empty length', () => {
      expect(generateSeparator('-', 0)).to.equal('');
    });

    it('should handle different characters', () => {
      expect(generateSeparator('#', 4)).to.equal('####');
      expect(generateSeparator('+', 3)).to.equal('+++');
    });
  });

  describe('isValidEmail', () => {
    it('should validate proper email addresses', () => {
      expect(isValidEmail('test@example.com')).to.be.true;
      expect(isValidEmail('user.name@domain.co.uk')).to.be.true;
      expect(isValidEmail('a@b.c')).to.be.true;
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('notanemail')).to.be.false;
      expect(isValidEmail('@example.com')).to.be.false;
      expect(isValidEmail('user@')).to.be.false;
      expect(isValidEmail('user name@example.com')).to.be.false;
    });

    it('should reject empty string', () => {
      expect(isValidEmail('')).to.be.false;
    });
  });

  describe('isValidUrl', () => {
    it('should validate proper URLs', () => {
      expect(isValidUrl('https://example.com')).to.be.true;
      expect(isValidUrl('http://github.com/path')).to.be.true;
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('example.com')).to.be.false;
      expect(isValidUrl('ftp://example.com')).to.be.false;
      expect(isValidUrl('/path/to/file')).to.be.false;
    });

    it('should reject empty string', () => {
      expect(isValidUrl('')).to.be.false;
    });
  });

  describe('isValidIdentifier', () => {
    it('should validate proper identifiers', () => {
      expect(isValidIdentifier('test_123')).to.be.true;
      expect(isValidIdentifier('CamelCase')).to.be.true;
      expect(isValidIdentifier('snake-case')).to.be.true;
      expect(isValidIdentifier('a')).to.be.true;
    });

    it('should reject invalid identifiers', () => {
      expect(isValidIdentifier('123start')).to.be.true; // numbers allowed
      expect(isValidIdentifier('test space')).to.be.false;
      expect(isValidIdentifier('test@var')).to.be.false;
      expect(isValidIdentifier('test.dot')).to.be.false;
    });

    it('should reject empty string', () => {
      expect(isValidIdentifier('')).to.be.false;
    });
  });

  describe('escapeRegex', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegex('a.b')).to.equal('a\\.b');
      expect(escapeRegex('a*b')).to.equal('a\\*b');
      expect(escapeRegex('a+b')).to.equal('a\\+b');
      expect(escapeRegex('a?b')).to.equal('a\\?b');
    });

    it('should escape brackets', () => {
      expect(escapeRegex('[abc]')).to.equal('\\[abc\\]');
      expect(escapeRegex('(abc)')).to.equal('\\(abc\\)');
      expect(escapeRegex('{abc}')).to.equal('\\{abc\\}');
    });

    it('should escape pipe character', () => {
      expect(escapeRegex('a|b')).to.equal('a\\|b');
    });

    it('should escape backslash', () => {
      expect(escapeRegex('a\\b')).to.equal('a\\\\b');
    });

    it('should handle strings without special characters', () => {
      expect(escapeRegex('abc')).to.equal('abc');
      expect(escapeRegex('hello')).to.equal('hello');
    });

    it('should handle empty string', () => {
      expect(escapeRegex('')).to.equal('');
    });

    it('should escape caret and dollar sign', () => {
      expect(escapeRegex('^abc$')).to.equal('\\^abc\\$');
    });
  });
});



