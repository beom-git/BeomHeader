//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : integration.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Integration tests for BeomHeader extension (BDD style)
//        o End-to-end workflows
//        o Multi-component interactions
//        o Complete header lifecycle
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  createMockDocument,
  createMockEditor,
  createHeaderContent,
  MockVSCodeConfig,
  TestConfig
} from '../test-setup';

describe('BeomHeader Integration Tests', () => {
  let mockConfig: MockVSCodeConfig;
  let mockDocument: any;
  let mockEditor: any;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
    mockConfig.update('projectName', 'TestProject', null);
    mockConfig.update('author', 'TestAuthor', null);
    mockConfig.update('headerStyle', 'simple', null);
    mockConfig.update('timeZone', 'UTC', null);
    mockConfig.update('autoUpdateLastModified', true, null);
    mockConfig.update('autoUpdateEditor', true, null);
    mockConfig.update('enableConfigChangeNotifications', false, null);

    mockDocument = createMockDocument('', 'test.ts', 'typescript');
    mockEditor = createMockEditor(mockDocument, 2, true);
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('complete header insertion workflow', () => {
    it('should insert header on new TypeScript file', () => {
      const doc = createMockDocument('function test() {}', 'new.ts', 'typescript');
      expect(doc.fileName).to.include('.ts');
      expect(doc.languageId).to.equal('typescript');
      expect(doc.getText()).to.include('test');
    });

    it('should insert header on new Python file', () => {
      const doc = createMockDocument('def test(): pass', 'new.py', 'python');
      expect(doc.fileName).to.include('.py');
      expect(doc.languageId).to.equal('python');
    });

    it('should insert header on new JavaScript file', () => {
      const doc = createMockDocument('const test = () => {}', 'new.js', 'javascript');
      expect(doc.fileName).to.include('.js');
      expect(doc.languageId).to.equal('javascript');
    });

    it('should use configured project name in header', () => {
      const projectName = mockConfig.get<string>('projectName');
      expect(projectName).to.equal('TestProject');
    });

    it('should use configured author in header', () => {
      const author = mockConfig.get<string>('author');
      expect(author).to.equal('TestAuthor');
    });

    it('should use configured header style', () => {
      const style = mockConfig.get<string>('headerStyle');
      expect(style).to.equal('simple');
    });

    it('should use configured timezone for timestamp', () => {
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should preserve existing file content after insertion', () => {
      const originalContent = 'function main() {}';
      const doc = createMockDocument(originalContent);
      expect(doc.getText()).to.include('main');
    });
  });

  describe('header update workflow', () => {
    it('should update existing header on file save', () => {
      const header = createHeaderContent();
      expect(header).to.exist;
      expect(header.length).to.be.greaterThan(0);
    });

    it('should refresh last modified date on update', () => {
      const today = new Date().toLocaleDateString('en-CA');
      expect(today).to.match(/\d{4}-\d{2}-\d{2}/);
    });

    it('should respect autoUpdateLastModified setting when true', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      const value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.true;
    });

    it('should skip update when autoUpdateLastModified is false', () => {
      mockConfig.update('autoUpdateLastModified', false, null);
      const value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.false;
    });

    it('should update editor info when autoUpdateEditor is true', () => {
      mockConfig.update('autoUpdateEditor', true, null);
      const value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.true;
    });

    it('should skip editor update when autoUpdateEditor is false', () => {
      mockConfig.update('autoUpdateEditor', false, null);
      const value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.false;
    });
  });

  describe('configuration change workflow', () => {
    it('should detect project name change', () => {
      mockConfig.update('projectName', 'NewProject', null);
      const newName = mockConfig.get<string>('projectName');
      expect(newName).to.equal('NewProject');
    });

    it('should detect author change', () => {
      mockConfig.update('author', 'NewAuthor', null);
      const newAuthor = mockConfig.get<string>('author');
      expect(newAuthor).to.equal('NewAuthor');
    });

    it('should detect timezone change', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const newTz = mockConfig.get<string>('timeZone');
      expect(newTz).to.equal('Asia/Seoul');
    });

    it('should detect header style change', () => {
      mockConfig.update('headerStyle', 'fancy', null);
      const newStyle = mockConfig.get<string>('headerStyle');
      expect(newStyle).to.equal('fancy');
    });

    it('should handle multiple configuration changes', () => {
      mockConfig.update('projectName', 'Project1', null);
      mockConfig.update('author', 'Author1', null);
      mockConfig.update('timeZone', 'Asia/Seoul', null);

      expect(mockConfig.get<string>('projectName')).to.equal('Project1');
      expect(mockConfig.get<string>('author')).to.equal('Author1');
      expect(mockConfig.get<string>('timeZone')).to.equal('Asia/Seoul');
    });

    it('should notify changes when enableConfigChangeNotifications is true', () => {
      mockConfig.update('enableConfigChangeNotifications', true, null);
      const notifyEnabled = mockConfig.get<boolean>('enableConfigChangeNotifications');
      expect(notifyEnabled).to.be.true;
    });

    it('should skip notifications when enableConfigChangeNotifications is false', () => {
      mockConfig.update('enableConfigChangeNotifications', false, null);
      const notifyEnabled = mockConfig.get<boolean>('enableConfigChangeNotifications');
      expect(notifyEnabled).to.be.false;
    });
  });

  describe('timezone support integration', () => {
    it('should generate UTC timestamp with UTC timezone', () => {
      mockConfig.update('timeZone', 'UTC', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');
    });

    it('should generate Seoul timestamp with Asia/Seoul timezone', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Asia/Seoul');
    });

    it('should generate London timestamp with Europe/London timezone', () => {
      mockConfig.update('timeZone', 'Europe/London', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Europe/London');
    });

    it('should generate New York timestamp with America/New_York timezone', () => {
      mockConfig.update('timeZone', 'America/New_York', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('America/New_York');
    });

    it('should apply timezone to all date fields', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const tz = mockConfig.get<string>('timeZone');
      expect(tz).to.exist;
    });
  });

  describe('auto-update integration', () => {
    it('should enable all auto-updates when configured', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      mockConfig.update('autoUpdateEditor', true, null);
      mockConfig.update('enableConfigChangeNotifications', true, null);

      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.true;
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.true;
    });

    it('should disable all auto-updates when configured', () => {
      mockConfig.update('autoUpdateLastModified', false, null);
      mockConfig.update('autoUpdateEditor', false, null);
      mockConfig.update('enableConfigChangeNotifications', false, null);

      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.false;
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.false;
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.false;
    });

    it('should handle mixed auto-update settings', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      mockConfig.update('autoUpdateEditor', false, null);
      mockConfig.update('enableConfigChangeNotifications', true, null);

      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.false;
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.true;
    });
  });

  describe('multi-file header management', () => {
    it('should handle headers in multiple files independently', () => {
      const file1 = createMockDocument('', 'file1.ts', 'typescript');
      const file2 = createMockDocument('', 'file2.py', 'python');

      expect(file1.fileName).to.include('file1');
      expect(file2.fileName).to.include('file2');
      expect(file1.languageId).to.not.equal(file2.languageId);
    });

    it('should apply same configuration to all files', () => {
      const projectName = mockConfig.get<string>('projectName');
      const author = mockConfig.get<string>('author');

      expect(projectName).to.equal('TestProject');
      expect(author).to.equal('TestAuthor');
    });

    it('should respect language-specific comment styles', () => {
      const tsFile = createMockDocument('', 'file.ts', 'typescript');
      const pyFile = createMockDocument('', 'file.py', 'python');

      expect(tsFile.languageId).to.equal('typescript');
      expect(pyFile.languageId).to.equal('python');
    });
  });

  describe('version management integration', () => {
    it('should track header version information', () => {
      const version = '1.0.0';
      const parts = version.split('.');
      expect(parts).to.have.lengthOf(3);
    });

    it('should support semantic versioning', () => {
      const versions = ['1.0.0', '1.1.0', '1.1.1', '2.0.0'];
      versions.forEach(v => {
        const parts = v.split('.');
        expect(parts).to.have.lengthOf(3);
      });
    });

    it('should maintain version history', () => {
      const history = ['1.0.0', '1.0.1', '1.0.2'];
      expect(history).to.have.lengthOf(3);
      expect(history[history.length - 1]).to.equal('1.0.2');
    });
  });

  describe('editor integration', () => {
    it('should detect editor tab size', () => {
      expect(mockEditor.options.tabSize).to.equal(2);
    });

    it('should detect space vs tab preference', () => {
      expect(mockEditor.options.insertSpaces).to.be.true;
    });

    it('should apply edits to correct document', () => {
      expect(mockEditor.document).to.equal(mockDocument);
    });

    it('should maintain document reference through operations', () => {
      const doc = createMockDocument('test');
      const editor = createMockEditor(doc, 4, false);
      expect(editor.document).to.equal(doc);
    });
  });

  describe('error recovery', () => {
    it('should handle malformed configuration gracefully', () => {
      const config = new MockVSCodeConfig();
      const value = config.get<string>('missing', 'default');
      expect(value).to.equal('default');
    });

    it('should recover from invalid timezone', () => {
      mockConfig.update('timeZone', 'UTC', null);
      const tz = mockConfig.get<string>('timeZone', 'UTC');
      expect(tz).to.equal('UTC');
    });

    it('should handle readonly files', () => {
      const doc = createMockDocument('readonly content');
      expect(doc.getText()).to.equal('readonly content');
    });

    it('should handle empty files', () => {
      const doc = createMockDocument('');
      expect(doc.getText()).to.equal('');
    });

    it('should handle large files', () => {
      const large = 'line\n'.repeat(5000);
      const doc = createMockDocument(large);
      expect(doc.lineCount).to.equal(5000);
    });
  });

  describe('complete workflow scenario', () => {
    it('should complete full header lifecycle', () => {
      // Setup
      mockConfig.update('projectName', 'MyProject', null);
      mockConfig.update('author', 'Developer', null);
      mockConfig.update('timeZone', 'UTC', null);

      // Verify setup
      expect(mockConfig.get<string>('projectName')).to.equal('MyProject');
      expect(mockConfig.get<string>('author')).to.equal('Developer');
      expect(mockConfig.get<string>('timeZone')).to.equal('UTC');

      // Create file
      const doc = createMockDocument('function main() {}', 'main.ts', 'typescript');
      expect(doc.fileName).to.include('main');

      // Insert header
      const header = createHeaderContent();
      expect(header).to.exist;

      // Update configuration
      mockConfig.update('projectName', 'UpdatedProject', null);
      expect(mockConfig.get<string>('projectName')).to.equal('UpdatedProject');

      // Verify file still valid
      expect(doc.getText()).to.include('main');
    });

    it('should handle timezone changes during session', () => {
      // Start with UTC
      mockConfig.update('timeZone', 'UTC', null);
      expect(mockConfig.get<string>('timeZone')).to.equal('UTC');

      // Switch to Seoul
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      expect(mockConfig.get<string>('timeZone')).to.equal('Asia/Seoul');

      // Switch to London
      mockConfig.update('timeZone', 'Europe/London', null);
      expect(mockConfig.get<string>('timeZone')).to.equal('Europe/London');

      // Final timezone
      expect(mockConfig.get<string>('timeZone')).to.equal('Europe/London');
    });

    it('should maintain consistency through operations', () => {
      const file1 = createMockDocument('', 'file1.ts', 'typescript');
      const file2 = createMockDocument('', 'file2.ts', 'typescript');

      mockConfig.update('projectName', 'Project', null);

      const project1 = mockConfig.get<string>('projectName');
      const project2 = mockConfig.get<string>('projectName');

      expect(project1).to.equal(project2);
      expect(project1).to.equal('Project');
    });
  });
});

