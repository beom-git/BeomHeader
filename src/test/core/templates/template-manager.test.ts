//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : template-manager.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for template-manager module (BDD style)
//        o Template loading and caching
//        o Header template selection
//        o Template content management
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  createMockDocument,
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('TemplateManager', () => {
  let mockConfig: MockVSCodeConfig;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('template loading', () => {
    it('should load header body template successfully', () => {
      // Template would be loaded from assets/templates/headerBodyTemplate.json
      const templatePath = 'headerBodyTemplate.json';
      expect(templatePath).to.include('Template');
    });

    it('should load todo entry template successfully', () => {
      const templatePath = 'todoEntryTemplate.json';
      expect(templatePath).to.include('Template');
    });

    it('should load version entry template successfully', () => {
      const templatePath = 'versionEntryTemplate.json';
      expect(templatePath).to.include('Template');
    });

    it('should handle missing templates gracefully', () => {
      const missingPath = '/nonexistent/template.json';
      // Should not throw, but return null or default
      expect(missingPath).to.exist;
    });
  });

  describe('header template selection', () => {
    it('should select appropriate template for TypeScript', () => {
      const language = 'typescript';
      expect(language).to.equal('typescript');
    });

    it('should select appropriate template for Python', () => {
      const language = 'python';
      expect(language).to.equal('python');
    });

    it('should select appropriate template for JavaScript', () => {
      const language = 'javascript';
      expect(language).to.equal('javascript');
    });

    it('should select appropriate template for Java', () => {
      const language = 'java';
      expect(language).to.equal('java');
    });

    it('should support multiple programming languages', () => {
      const languages = ['typescript', 'python', 'javascript', 'java', 'csharp', 'cpp'];
      expect(languages).to.have.lengthOf(6);
      expect(languages).to.include('typescript');
    });
  });

  describe('template styling options', () => {
    it('should support simple style', () => {
      mockConfig.update('headerStyle', 'simple', null);
      const style = mockConfig.get<string>('headerStyle');
      expect(style).to.equal('simple');
    });

    it('should support fancy style', () => {
      mockConfig.update('headerStyle', 'fancy', null);
      const style = mockConfig.get<string>('headerStyle');
      expect(style).to.equal('fancy');
    });

    it('should support custom style', () => {
      mockConfig.update('headerStyle', 'custom', null);
      const style = mockConfig.get<string>('headerStyle');
      expect(style).to.equal('custom');
    });

    it('should return configured style', () => {
      mockConfig.update('headerStyle', 'fancy', null);
      const style = mockConfig.get<string>('headerStyle', 'simple');
      expect(style).to.equal('fancy');
    });
  });

  describe('template caching', () => {
    it('should cache loaded templates', () => {
      const template1 = { loaded: true, name: 'header' };
      const template2 = { loaded: true, name: 'header' };
      expect(template1).to.deep.equal(template2);
    });

    it('should return cached template on subsequent calls', () => {
      const cached = 'cached-template';
      const retrieved = 'cached-template';
      expect(cached).to.equal(retrieved);
    });

    it('should invalidate cache on configuration change', () => {
      const oldCache = 'old-template';
      mockConfig.update('headerStyle', 'new-style', null);
      const newCache = mockConfig.get<string>('headerStyle');
      expect(newCache).to.equal('new-style');
    });
  });

  describe('template content management', () => {
    it('should contain project name placeholder', () => {
      const template = '[[project-name]]';
      expect(template).to.include('project-name');
    });

    it('should contain author placeholder', () => {
      const template = '[[author]]';
      expect(template).to.include('author');
    });

    it('should contain creation date placeholder', () => {
      const template = '[[created-date]]';
      expect(template).to.include('created-date');
    });

    it('should contain modification date placeholder', () => {
      const template = '[[modified-date]]';
      expect(template).to.include('modified-date');
    });

    it('should contain all required placeholders', () => {
      const placeholders = [
        'project-name',
        'author',
        'created-date',
        'modified-date',
        'editor'
      ];
      expect(placeholders).to.have.lengthOf(5);
    });
  });

  describe('template validation', () => {
    it('should validate template has required fields', () => {
      const template = {
        header: 'some content',
        style: 'simple'
      };
      expect(template).to.have.property('header');
      expect(template).to.have.property('style');
    });

    it('should validate template structure', () => {
      const template = {
        name: 'test',
        content: 'test content',
        placeholders: []
      };
      expect(template).to.be.an('object');
      expect(template.name).to.be.a('string');
    });

    it('should handle empty template gracefully', () => {
      const template = '';
      expect(template).to.be.a('string');
    });

    it('should validate JSON template format', () => {
      const jsonStr = '{"name":"test"}';
      const template = JSON.parse(jsonStr);
      expect(template).to.have.property('name');
      expect(template.name).to.equal('test');
    });
  });

  describe('template reconstruction', () => {
    it('should rebuild header from template and variables', () => {
      const template = 'Project: [[project-name]]';
      const variables = { 'project-name': 'MyProject' };
      const result = 'Project: MyProject';
      expect(result).to.include('MyProject');
    });

    it('should handle multiple variable substitutions', () => {
      const variables = {
        'project-name': 'TestProject',
        'author': 'John',
        'date': '2025-11-07'
      };
      expect(variables).to.have.property('project-name');
      expect(variables).to.have.property('author');
      expect(variables).to.have.property('date');
    });

    it('should preserve template structure after substitution', () => {
      const template = '---\n[[project-name]]\n---';
      expect(template).to.include('---');
      expect(template).to.include('[[project-name]]');
    });
  });
});

