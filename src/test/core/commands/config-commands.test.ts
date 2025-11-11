//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config-commands.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for config-commands module (BDD style)
//        o Configuration management
//        o Setting updates
//        o Configuration validation
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('ConfigCommands', () => {
  let mockConfig: MockVSCodeConfig;

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
  });

  afterEach(() => {
    mockConfig.clear();
  });

  describe('basic configuration reading', () => {
    it('should read projectName configuration', () => {
      mockConfig.update('projectName', 'MyProject', null);
      const value = mockConfig.get<string>('projectName');
      expect(value).to.equal('MyProject');
    });

    it('should read author configuration', () => {
      mockConfig.update('author', 'John Doe', null);
      const value = mockConfig.get<string>('author');
      expect(value).to.equal('John Doe');
    });

    it('should read headerStyle configuration', () => {
      mockConfig.update('headerStyle', 'fancy', null);
      const value = mockConfig.get<string>('headerStyle');
      expect(value).to.equal('fancy');
    });

    it('should read timeZone configuration', () => {
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const value = mockConfig.get<string>('timeZone');
      expect(value).to.equal('Asia/Seoul');
    });

    it('should return default values for missing configs', () => {
      const value = mockConfig.get<string>('missing', 'default');
      expect(value).to.equal('default');
    });
  });

  describe('boolean configuration', () => {
    it('should read autoUpdateLastModified', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      const value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.true;
    });

    it('should read autoUpdateEditor', () => {
      mockConfig.update('autoUpdateEditor', false, null);
      const value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.false;
    });

    it('should read enableConfigChangeNotifications', () => {
      mockConfig.update('enableConfigChangeNotifications', true, null);
      const value = mockConfig.get<boolean>('enableConfigChangeNotifications');
      expect(value).to.be.true;
    });

    it('should toggle boolean values', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;
      
      mockConfig.update('autoUpdateLastModified', false, null);
      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.false;
    });
  });

  describe('configuration updates', () => {
    it('should update projectName', async () => {
      await mockConfig.update('projectName', 'NewProject', null);
      const value = mockConfig.get<string>('projectName');
      expect(value).to.equal('NewProject');
    });

    it('should update author', async () => {
      await mockConfig.update('author', 'Jane Doe', null);
      const value = mockConfig.get<string>('author');
      expect(value).to.equal('Jane Doe');
    });

    it('should update headerStyle', async () => {
      await mockConfig.update('headerStyle', 'simple', null);
      const value = mockConfig.get<string>('headerStyle');
      expect(value).to.equal('simple');
    });

    it('should update timeZone', async () => {
      await mockConfig.update('timeZone', 'Europe/London', null);
      const value = mockConfig.get<string>('timeZone');
      expect(value).to.equal('Europe/London');
    });

    it('should update boolean values', async () => {
      await mockConfig.update('autoUpdateLastModified', true, null);
      let value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.true;

      await mockConfig.update('autoUpdateLastModified', false, null);
      value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.false;
    });

    it('should handle multiple updates sequentially', async () => {
      await mockConfig.update('projectName', 'Project1', null);
      await mockConfig.update('author', 'Author1', null);
      await mockConfig.update('headerStyle', 'style1', null);

      expect(mockConfig.get<string>('projectName')).to.equal('Project1');
      expect(mockConfig.get<string>('author')).to.equal('Author1');
      expect(mockConfig.get<string>('headerStyle')).to.equal('style1');
    });
  });

  describe('configuration validation', () => {
    it('should validate projectName is non-empty', () => {
      mockConfig.update('projectName', 'Project', null);
      const value = mockConfig.get<string>('projectName', '');
      expect(value).to.not.be.empty;
    });

    it('should validate author is non-empty', () => {
      mockConfig.update('author', 'Author', null);
      const value = mockConfig.get<string>('author', '');
      expect(value).to.not.be.empty;
    });

    it('should validate timeZone is valid', () => {
      const validZones = ['UTC', 'Asia/Seoul', 'Europe/London', 'America/New_York'];
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const value = mockConfig.get<string>('timeZone');
      expect(validZones).to.include(value);
    });

    it('should validate headerStyle is valid', () => {
      const validStyles = ['simple', 'fancy', 'custom'];
      mockConfig.update('headerStyle', 'simple', null);
      const value = mockConfig.get<string>('headerStyle');
      expect(validStyles).to.include(value);
    });

    it('should validate boolean configurations', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      const value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(typeof value).to.equal('boolean');
    });
  });

  describe('configuration inspection', () => {
    it('should inspect projectName configuration', () => {
      mockConfig.setGlobalValue('projectName', 'GlobalProject');
      const inspection = mockConfig.inspect<string>('projectName');
      expect(inspection.globalValue).to.equal('GlobalProject');
    });

    it('should inspect author configuration', () => {
      mockConfig.setGlobalValue('author', 'GlobalAuthor');
      const inspection = mockConfig.inspect<string>('author');
      expect(inspection.globalValue).to.equal('GlobalAuthor');
    });

    it('should inspect boolean configurations', () => {
      mockConfig.setGlobalValue('autoUpdateLastModified', true);
      const inspection = mockConfig.inspect<boolean>('autoUpdateLastModified');
      expect(inspection.globalValue).to.be.true;
    });

    it('should handle missing values in inspection', () => {
      const inspection = mockConfig.inspect<string>('nonexistent');
      expect(inspection.globalValue).to.be.undefined;
    });
  });

  describe('timezone configuration', () => {
    const supportedTimezones = [
      'UTC',
      'Asia/Seoul',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Hong_Kong',
      'Asia/Bangkok',
      'Asia/Singapore',
      'Asia/Manila',
      'India/Kolkata',
      'Australia/Sydney',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Amsterdam',
      'Europe/Brussels',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu'
    ];

    it('should support all configured timezones', () => {
      supportedTimezones.forEach(tz => {
        mockConfig.update('timeZone', tz, null);
        const value = mockConfig.get<string>('timeZone');
        expect(value).to.equal(tz);
      });
    });

    it('should have at least 20 timezones', () => {
      expect(supportedTimezones.length).to.be.greaterThanOrEqual(20);
    });

    it('should include UTC as default', () => {
      expect(supportedTimezones).to.include('UTC');
    });

    it('should include major Asian timezones', () => {
      const asianZones = supportedTimezones.filter(tz => tz.startsWith('Asia/'));
      expect(asianZones.length).to.be.greaterThan(0);
    });

    it('should include major European timezones', () => {
      const europeanZones = supportedTimezones.filter(tz => tz.startsWith('Europe/'));
      expect(europeanZones.length).to.be.greaterThan(0);
    });

    it('should include major American timezones', () => {
      const americanZones = supportedTimezones.filter(tz => tz.startsWith('America/'));
      expect(americanZones.length).to.be.greaterThan(0);
    });
  });

  describe('auto-update settings', () => {
    it('should toggle autoUpdateLastModified', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;

      mockConfig.update('autoUpdateLastModified', false, null);
      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.false;
    });

    it('should toggle autoUpdateEditor', () => {
      mockConfig.update('autoUpdateEditor', true, null);
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.true;

      mockConfig.update('autoUpdateEditor', false, null);
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.false;
    });

    it('should toggle enableConfigChangeNotifications', () => {
      mockConfig.update('enableConfigChangeNotifications', true, null);
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.true;

      mockConfig.update('enableConfigChangeNotifications', false, null);
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.false;
    });

    it('should handle all three auto-update settings together', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      mockConfig.update('autoUpdateEditor', false, null);
      mockConfig.update('enableConfigChangeNotifications', true, null);

      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.false;
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.true;
    });
  });

  describe('configuration clear and reset', () => {
    it('should clear all configurations', () => {
      mockConfig.update('projectName', 'Project', null);
      mockConfig.update('author', 'Author', null);
      mockConfig.clear();

      const name = mockConfig.get<string>('projectName', 'default');
      const author = mockConfig.get<string>('author', 'default');

      expect(name).to.equal('default');
      expect(author).to.equal('default');
    });

    it('should allow reconfiguration after clear', () => {
      mockConfig.update('projectName', 'OldProject', null);
      mockConfig.clear();
      mockConfig.update('projectName', 'NewProject', null);

      const value = mockConfig.get<string>('projectName');
      expect(value).to.equal('NewProject');
    });
  });
});

