//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : validation-utils.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for validation-utils module
//        o Input validation utilities
//        o Format validation
//        o Error handling
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import {
  validateLanguageId,
  validateCommentToken,
  validateEmail,
  validateUrl,
  validateCopyrightNotice,
  validateProjectDescription,
  validateSeparatorLength,
  validateYearInput,
  ValidationResult
} from '../../utils/validation-utils';

describe('validation-utils', () => {
  describe('validateLanguageId', () => {
    it('should accept valid language IDs', () => {
      const result = validateLanguageId('typescript');
      expect(result.isValid).to.be.true;
      expect(result.errorMessage).to.be.undefined;
    });

    it('should accept language IDs with hyphens and underscores', () => {
      expect(validateLanguageId('my-lang').isValid).to.be.true;
      expect(validateLanguageId('my_lang').isValid).to.be.true;
    });

    it('should reject empty language IDs', () => {
      const result = validateLanguageId('');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('cannot be empty');
    });

    it('should reject language IDs with special characters', () => {
      const result = validateLanguageId('lang@id');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('letters, numbers');
    });
  });

  describe('validateCommentToken', () => {
    it('should accept valid comment tokens', () => {
      expect(validateCommentToken('//').isValid).to.be.true;
      expect(validateCommentToken('#').isValid).to.be.true;
      expect(validateCommentToken('--').isValid).to.be.true;
    });

    it('should reject empty comment tokens', () => {
      const result = validateCommentToken('');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('cannot be empty');
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com').isValid).to.be.true;
    });

    it('should accept empty email (optional field)', () => {
      expect(validateEmail('').isValid).to.be.true;
    });

    it('should reject invalid email addresses', () => {
      const result = validateEmail('notanemail');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('valid email');
    });
  });

  describe('validateUrl', () => {
    it('should accept valid URLs', () => {
      expect(validateUrl('https://example.com').isValid).to.be.true;
      expect(validateUrl('http://github.com').isValid).to.be.true;
    });

    it('should accept empty URL (optional field)', () => {
      expect(validateUrl('').isValid).to.be.true;
    });

    it('should reject invalid URLs', () => {
      const result = validateUrl('not a url');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('HTTP or HTTPS');
    });
  });

  describe('validateCopyrightNotice', () => {
    it('should accept valid copyright notices', () => {
      expect(validateCopyrightNotice('(C) Copyright 2025').isValid).to.be.true;
    });

    it('should reject empty copyright notices', () => {
      const result = validateCopyrightNotice('');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('cannot be empty');
    });
  });

  describe('validateProjectDescription', () => {
    it('should accept valid project descriptions', () => {
      expect(validateProjectDescription('This is a project').isValid).to.be.true;
    });

    it('should reject empty descriptions', () => {
      const result = validateProjectDescription('');
      expect(result.isValid).to.be.false;
      expect(result.errorMessage).to.include('cannot be empty');
    });
  });

  describe('validateSeparatorLength', () => {
    it('should accept valid separator lengths', () => {
      expect(validateSeparatorLength('70').isValid).to.be.true;
      expect(validateSeparatorLength('10').isValid).to.be.true;
      expect(validateSeparatorLength('200').isValid).to.be.true;
    });

    it('should reject lengths outside valid range', () => {
      expect(validateSeparatorLength('5').isValid).to.be.false;
      expect(validateSeparatorLength('201').isValid).to.be.false;
    });

    it('should reject non-numeric input', () => {
      expect(validateSeparatorLength('abc').isValid).to.be.false;
    });
  });

  describe('validateYearInput', () => {
    it('should accept valid years', () => {
      const currentYear = new Date().getFullYear();
      expect(validateYearInput('2025').isValid).to.be.true;
      expect(validateYearInput((currentYear).toString()).isValid).to.be.true;
    });

    it('should reject years before 1900', () => {
      const result = validateYearInput('1899');
      expect(result.isValid).to.be.false;
    });

    it('should reject years too far in future', () => {
      const futureYear = (new Date().getFullYear() + 20).toString();
      expect(validateYearInput(futureYear).isValid).to.be.false;
    });

    it('should reject non-numeric input', () => {
      expect(validateYearInput('abc').isValid).to.be.false;
    });
  });
});



