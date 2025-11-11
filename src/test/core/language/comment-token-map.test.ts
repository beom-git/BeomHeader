//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : comment-token-map.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, space size (4)
// Description   : 
//
//     Unit tests for comment-token-map module (BDD style)
//        o Language comment token mapping
//        o Language detection and support
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import { getCommentToken, getSupportedLanguageIds } from '../../../core/language/comment-token-map';

describe('Comment Token Map', () => {
  describe('getCommentToken', () => {
    describe('when given a supported language ID', () => {
      it('should return the comment token for TypeScript', () => {
        const token = getCommentToken('typescript');
        expect(token).to.exist;
        expect(token).to.deep.include({ single: '//' });
      });

      it('should return the comment token for Python', () => {
        const token = getCommentToken('python');
        expect(token).to.exist;
        expect(token).to.deep.include({ single: '#' });
      });

      it('should return the comment token for JavaScript', () => {
        const token = getCommentToken('javascript');
        expect(token).to.exist;
        expect(token).to.deep.include({ single: '//' });
      });

      it('should return different comment tokens for different languages', () => {
        const tsToken = getCommentToken('typescript');
        const pyToken = getCommentToken('python');
        expect(tsToken).to.not.deep.equal(pyToken);
      });
    });

    describe('when given an unsupported language ID', () => {
      it('should return a default comment token', () => {
        const token = getCommentToken('unknown-language');
        expect(token).to.exist;
        expect(token).to.have.property('single');
      });

      it('should not throw an error', () => {
        expect(() => getCommentToken('xyz123')).to.not.throw();
      });
    });

    describe('when given case variations', () => {
      it('should handle uppercase language IDs', () => {
        const token = getCommentToken('PYTHON');
        expect(token).to.exist;
      });

      it('should handle mixed case language IDs', () => {
        const token = getCommentToken('TypeScript');
        expect(token).to.exist;
      });
    });

    describe('multi-line comment support', () => {
      it('should return block comment tokens when available', () => {
        const token = getCommentToken('javascript');
        // JavaScript supports /* */ for block comments
        if (token.multi) {
          expect(token.multi).to.have.property('start');
          expect(token.multi).to.have.property('end');
        }
      });
    });
  });

  describe('getSupportedLanguageIds', () => {
    it('should return an array of supported language IDs', () => {
      const languages = getSupportedLanguageIds();
      expect(languages).to.be.an('array');
      expect(languages.length).to.be.greaterThan(0);
    });

    it('should include common languages', () => {
      const languages = getSupportedLanguageIds();
      const commonLanguages = ['typescript', 'javascript', 'python', 'java'];
      commonLanguages.forEach(lang => {
        expect(languages).to.include(lang.toLowerCase());
      });
    });

    it('should return unique language IDs', () => {
      const languages = getSupportedLanguageIds();
      const uniqueLanguages = new Set(languages);
      expect(uniqueLanguages.size).to.equal(languages.length);
    });

    it('should contain at least 20 languages', () => {
      const languages = getSupportedLanguageIds();
      expect(languages.length).to.be.at.least(20);
    });
  });

  describe('Comment token consistency', () => {
    it('should have consistent token structure', () => {
      const languages = getSupportedLanguageIds().slice(0, 5);
      languages.forEach(lang => {
        const token = getCommentToken(lang);
        expect(token).to.have.property('single');
        expect(token.single).to.be.a('string');
        expect(token.single.length).to.be.greaterThan(0);
      });
    });

    it('should not have empty comment tokens', () => {
      const languages = getSupportedLanguageIds();
      languages.forEach(lang => {
        const token = getCommentToken(lang);
        expect(token.single).to.not.be.empty;
      });
    });
  });
});

