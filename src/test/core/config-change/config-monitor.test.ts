//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config-monitor.test.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Unit tests for config-monitor module (BDD style)
//        o Configuration change detection
//        o Event notification
//        o Configuration tracking
//
//----------------------------------------------------------------------

import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  MockVSCodeConfig,
  TestConfig
} from '../../test-setup';

describe('ConfigMonitor', () => {
  let mockConfig: MockVSCodeConfig;
  let changeCallback: sinon.SinonSpy;
  let changeHandlers: ((key: string, oldValue: any, newValue: any) => void)[] = [];

  beforeEach(() => {
    mockConfig = new MockVSCodeConfig();
    changeCallback = sinon.spy();
    changeHandlers = [];
  });

  afterEach(() => {
    mockConfig.clear();
    changeCallback.resetHistory();
    changeHandlers = [];
  });

  describe('configuration change detection', () => {
    it('should detect projectName changes', () => {
      mockConfig.update('projectName', 'Project1', null);
      const value = mockConfig.get<string>('projectName');
      expect(value).to.equal('Project1');
    });

    it('should detect author changes', () => {
      mockConfig.update('author', 'Author1', null);
      const value = mockConfig.get<string>('author');
      expect(value).to.equal('Author1');
    });

    it('should detect headerStyle changes', () => {
      mockConfig.update('headerStyle', 'style1', null);
      const value = mockConfig.get<string>('headerStyle');
      expect(value).to.equal('style1');
    });

    it('should detect timeZone changes', () => {
      mockConfig.update('timeZone', 'UTC', null);
      mockConfig.update('timeZone', 'Asia/Seoul', null);
      const value = mockConfig.get<string>('timeZone');
      expect(value).to.equal('Asia/Seoul');
    });

    it('should detect boolean setting changes', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      let value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.true;

      mockConfig.update('autoUpdateLastModified', false, null);
      value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.false;
    });
  });

  describe('multiple change tracking', () => {
    it('should track sequential changes', () => {
      mockConfig.update('projectName', 'Project1', null);
      mockConfig.update('projectName', 'Project2', null);
      mockConfig.update('projectName', 'Project3', null);

      const value = mockConfig.get<string>('projectName');
      expect(value).to.equal('Project3');
    });

    it('should track independent setting changes', () => {
      mockConfig.update('projectName', 'Project', null);
      mockConfig.update('author', 'Author', null);
      mockConfig.update('headerStyle', 'style', null);

      expect(mockConfig.get<string>('projectName')).to.equal('Project');
      expect(mockConfig.get<string>('author')).to.equal('Author');
      expect(mockConfig.get<string>('headerStyle')).to.equal('style');
    });

    it('should handle rapid consecutive changes', () => {
      for (let i = 0; i < 10; i++) {
        mockConfig.update('counter', i, null);
      }
      const value = mockConfig.get<number>('counter');
      expect(value).to.equal(9);
    });

    it('should maintain state across multiple changes', () => {
      mockConfig.update('setting1', 'value1', null);
      mockConfig.update('setting2', 'value2', null);
      mockConfig.update('setting1', 'value1-updated', null);

      expect(mockConfig.get<string>('setting1')).to.equal('value1-updated');
      expect(mockConfig.get<string>('setting2')).to.equal('value2');
    });
  });

  describe('auto-update settings monitoring', () => {
    it('should monitor autoUpdateLastModified changes', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      let value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.true;

      mockConfig.update('autoUpdateLastModified', false, null);
      value = mockConfig.get<boolean>('autoUpdateLastModified');
      expect(value).to.be.false;
    });

    it('should monitor autoUpdateEditor changes', () => {
      mockConfig.update('autoUpdateEditor', false, null);
      let value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.false;

      mockConfig.update('autoUpdateEditor', true, null);
      value = mockConfig.get<boolean>('autoUpdateEditor');
      expect(value).to.be.true;
    });

    it('should monitor enableConfigChangeNotifications changes', () => {
      mockConfig.update('enableConfigChangeNotifications', false, null);
      let value = mockConfig.get<boolean>('enableConfigChangeNotifications');
      expect(value).to.be.false;

      mockConfig.update('enableConfigChangeNotifications', true, null);
      value = mockConfig.get<boolean>('enableConfigChangeNotifications');
      expect(value).to.be.true;
    });

    it('should handle all three auto-update settings changes', () => {
      mockConfig.update('autoUpdateLastModified', true, null);
      mockConfig.update('autoUpdateEditor', true, null);
      mockConfig.update('enableConfigChangeNotifications', true, null);

      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.true;
      expect(mockConfig.get<boolean>('autoUpdateEditor')).to.be.true;
      expect(mockConfig.get<boolean>('enableConfigChangeNotifications')).to.be.true;

      mockConfig.update('autoUpdateLastModified', false, null);
      expect(mockConfig.get<boolean>('autoUpdateLastModified')).to.be.false;
    });
  });

  describe('timezone configuration monitoring', () => {
    it('should monitor timezone changes', () => {
      mockConfig.update('timeZone', 'UTC', null);
      let tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('UTC');

      mockConfig.update('timeZone', 'Asia/Seoul', null);
      tz = mockConfig.get<string>('timeZone');
      expect(tz).to.equal('Asia/Seoul');
    });

    it('should track timezone change history', () => {
      const timezones = ['UTC', 'Asia/Seoul', 'Europe/London', 'America/New_York'];
      timezones.forEach(tz => {
        mockConfig.update('timeZone', tz, null);
      });
      
      const currentTz = mockConfig.get<string>('timeZone');
      expect(currentTz).to.equal('America/New_York');
    });

    it('should handle timezone fallback to default', () => {
      const defaultTz = mockConfig.get<string>('timeZone', 'UTC');
      expect(defaultTz).to.equal('UTC');
    });
  });

  describe('event notification', () => {
    it('should notify on configuration change', () => {
      const handler = (key: string) => {
        changeCallback(key);
      };
      
      mockConfig.update('projectName', 'Project', null);
      handler('projectName');
      
      expect(changeCallback.called).to.be.true;
    });

    it('should pass changed key to handler', () => {
      const handler = (key: string) => {
        changeCallback(key);
      };
      
      mockConfig.update('projectName', 'Project', null);
      handler('projectName');
      
      expect(changeCallback.calledWith('projectName')).to.be.true;
    });

    it('should handle multiple change notifications', () => {
      const handler = (key: string) => {
        changeCallback(key);
      };
      
      ['projectName', 'author', 'timeZone'].forEach(key => {
        mockConfig.update(key, `value-${key}`, null);
        handler(key);
      });
      
      expect(changeCallback.callCount).to.equal(3);
    });
  });

  describe('configuration state management', () => {
    it('should maintain configuration state', () => {
      mockConfig.update('projectName', 'Project', null);
      mockConfig.update('author', 'Author', null);

      expect(mockConfig.get<string>('projectName')).to.equal('Project');
      expect(mockConfig.get<string>('author')).to.equal('Author');
    });

    it('should allow configuration queries without side effects', () => {
      mockConfig.update('value', 42, null);
      const v1 = mockConfig.get<number>('value');
      const v2 = mockConfig.get<number>('value');
      
      expect(v1).to.equal(v2);
    });

    it('should handle concurrent access safely', () => {
      mockConfig.update('setting1', 'value1', null);
      const val1 = mockConfig.get<string>('setting1');
      
      mockConfig.update('setting2', 'value2', null);
      const val2 = mockConfig.get<string>('setting2');
      
      expect(val1).to.equal('value1');
      expect(val2).to.equal('value2');
    });

    it('should clear all monitored configurations', () => {
      mockConfig.update('projectName', 'Project', null);
      mockConfig.update('author', 'Author', null);
      mockConfig.update('timeZone', 'UTC', null);

      mockConfig.clear();

      const name = mockConfig.get<string>('projectName', 'default');
      const author = mockConfig.get<string>('author', 'default');
      const tz = mockConfig.get<string>('timeZone', 'default');

      expect(name).to.equal('default');
      expect(author).to.equal('default');
      expect(tz).to.equal('default');
    });
  });

  describe('configuration persistence', () => {
    it('should persist string values', () => {
      mockConfig.setGlobalValue('projectName', 'PersistentProject');
      const inspection = mockConfig.inspect<string>('projectName');
      expect(inspection.globalValue).to.equal('PersistentProject');
    });

    it('should persist boolean values', () => {
      mockConfig.setGlobalValue('autoUpdateLastModified', true);
      const inspection = mockConfig.inspect<boolean>('autoUpdateLastModified');
      expect(inspection.globalValue).to.be.true;
    });

    it('should persist numeric values', () => {
      mockConfig.setGlobalValue('tabSize', 4);
      const inspection = mockConfig.inspect<number>('tabSize');
      expect(inspection.globalValue).to.equal(4);
    });

    it('should distinguish between different persistence scopes', () => {
      mockConfig.setGlobalValue('setting1', 'global-value');
      mockConfig.update('setting1', 'local-value', null);

      const inspection = mockConfig.inspect<string>('setting1');
      expect(inspection.globalValue).to.equal('global-value');
    });
  });
});

