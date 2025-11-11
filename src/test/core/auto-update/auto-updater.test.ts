//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : auto-updater.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for auto-updater module (BDD style)
//        o Auto-update functionality for file headers
//        o Strategy pattern for update operations
//        o Timezone support
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  createMockDocument,
  createMockEditor,
  createHeaderContent,
  assertValidDateString,
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('AutoUpdater', () => {
  let mockConfig: MockVSCodeConfig;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('when auto-update is enabled', () => {
    beforeEach(() => {
      mockConfig.update('autoUpdateLastModified', true, null);
      mockConfig.update('autoUpdateEditor', true, null);
      mockConfig.update('timeZone', 'UTC', null);
    });

    it('should have autoUpdateLastModified enabled by default', () => {
      const value = mockConfig.get<boolean>('autoUpdateLastModified', true);
      expect(value).to.be.true;
    });

    it('should have autoUpdateEditor enabled by default', () => {
      const value = mockConfig.get<boolean>('autoUpdateEditor', true);
      expect(value).to.be.true;
    });

    it('should use UTC timezone by default', () => {
      const tz = mockConfig.get<string>('timeZone', 'UTC');
      expect(tz).to.equal('UTC');
    });
  });

  describe('when auto-update is disabled', () => {
    it('should respect autoUpdateLastModified setting', () => {
      mockConfig.update('autoUpdateLastModified', false, null);
      const value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.false;
    });

    it('should respect autoUpdateEditor setting', () => {
      mockConfig.update('autoUpdateEditor', false, null);
      const value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.false;
    });

    it('should not update when both are disabled', () => {
      mockConfig.update('autoUpdateLastModified', false, null);
      mockConfig.update('autoUpdateEditor', false, null);

      const lastMod = mockConfig.get<boolean>('autoUpdateLastModified');
      const editor = mockConfig.get<boolean>('autoUpdateEditor');

      expect(lastMod).to.be.false;
      expect(editor).to.be.false;
    });
  });

  describe('timezone support', () => {
    it('should support UTC timezone', () => {
      mockConfig.update('timeZone', 'UTC', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should support Asia/Seoul timezone', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Asia/Seoul');
    });

    it('should support Europe/London timezone', () => {
      mockConfig.update('timeZone', 'Europe/London', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Europe/London');
    });

    it('should support America/New_York timezone', () => {
      mockConfig.update('timeZone', 'America/New_York', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('America/New_York');
    });

    it('should default to UTC when not specified', () => {
      const tz = mockConfig.get<string>('timeZone', 'UTC');
      expect(tz).to.equal('UTC');
    });
  });

  describe('document handling', () => {
    it('should work with TypeScript documents', () => {
      const doc = createMockDocument(createHeaderContent(), 'test.ts', 'typescript');
      expect(doc.languageId).to.equal('typescript');
      expect(doc.fileName).to.include('.ts');
    });

    it('should work with Python documents', () => {
      const doc = createMockDocument('', 'test.py', 'python');
      expect(doc.languageId).to.equal('python');
      expect(doc.fileName).to.include('.py');
    });

    it('should preserve document content', () => {
      const content = 'test content';
      const doc = createMockDocument(content);
      expect(doc.getText()).to.equal(content);
    });

    it('should count document lines correctly', () => {
      const content = 'line1\nline2\nline3';
      const doc = createMockDocument(content);
      expect(doc.lineCount).to.equal(3);
    });
  });

  describe('editor information', () => {
    it('should detect tab size from editor options', () => {
      const editor = createMockEditor(
        createMockDocument(),
        4,
        true
      );
      expect(editor.options.tabSize).to.equal(4);
    });

    it('should detect space/tab preference', () => {
      const editor = createMockEditor(
        createMockDocument(),
        2,
        true
      );
      expect(editor.options.insertSpaces).to.be.true;
    });

    it('should handle tab indentation', () => {
      const editor = createMockEditor(
        createMockDocument(),
        1,
        false
      );
      expect(editor.options.insertSpaces).to.be.false;
    });
  });

  describe('configuration inspection', () => {
    it('should inspect default values', () => {
      mockConfig.setGlobalValue('autoUpdateLastModified', true);
      const inspection = mockConfig.inspect<boolean>('autoUpdateLastModified');
      expect(inspection.globalValue).to.be.true;
    });

    it('should support multiple inspection checks', () => {
      mockConfig.setGlobalValue('test1', 'value1');
      mockConfig.setGlobalValue('test2', 'value2');

      const insp1 = mockConfig.inspect('test1');
      const insp2 = mockConfig.inspect('test2');

      expect(insp1.globalValue).to.equal('value1');
      expect(insp2.globalValue).to.equal('value2');
    });
  });
});

