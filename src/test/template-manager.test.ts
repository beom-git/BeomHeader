//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : template-manager.test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 07:35:25 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test suite for template manager functionality
//        o Test template loading and caching
//        o Test different header styles
//        o Test version and todo templates
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as assert from 'assert';
import * as vscode from 'vscode';
import { TemplateManager } from '../core/templates/template-manager';

suite('Template Manager Test Suite', () => {
    let templateManager: TemplateManager;
    let extensionPath: string;

    setup(() => {
        extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        templateManager = TemplateManager.getInstance(extensionPath);
    });

    test('Should be a singleton', () => {
        const instance1 = TemplateManager.getInstance(extensionPath);
        const instance2 = TemplateManager.getInstance(extensionPath);
        
        assert.strictEqual(instance1, instance2, 'Should return the same instance');
    });

    test('Should provide available styles', () => {
        const styles = templateManager.getAvailableStyles();
        
        assert.ok(Array.isArray(styles), 'Should return an array of styles');
        assert.ok(styles.length > 0, 'Should have at least one style');
        assert.ok(styles.includes('standard'), 'Should include standard style');
    });

    test('Should get header template for different styles', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        // Test with standard style
        const standardTemplate = templateManager.getHeaderBodyTemplate(config);
        assert.ok(Array.isArray(standardTemplate), 'Should return array of template lines');
        assert.ok(standardTemplate.length > 0, 'Should have template content');
        
        // Template should contain expected sections
        const templateContent = standardTemplate.join('\n');
        assert.ok(templateContent.includes('Description'), 'Should contain Description section');
        assert.ok(templateContent.includes('File History'), 'Should contain File History section');
        assert.ok(templateContent.includes('To-Do List'), 'Should contain To-Do List section');
    });

    test('Should get version entry template', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const versionTemplate = templateManager.getVersionEntryTemplate(config);
        
        assert.ok(typeof versionTemplate === 'string', 'Should return string template');
        assert.ok(versionTemplate.includes('${today}'), 'Should contain date placeholder');
        assert.ok(versionTemplate.includes('${version}'), 'Should contain version placeholder');
        assert.ok(versionTemplate.includes('${author}'), 'Should contain author placeholder');
    });

    test('Should get todo entry template', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const todoTemplate = templateManager.getTodoEntryTemplate(config);
        
        assert.ok(typeof todoTemplate === 'string', 'Should return string template');
        assert.ok(todoTemplate.includes('${today}'), 'Should contain date placeholder');
        assert.ok(todoTemplate.includes('${index}'), 'Should contain index placeholder');
        assert.ok(todoTemplate.includes('${author}'), 'Should contain author placeholder');
        assert.ok(todoTemplate.includes('ToDo#'), 'Should contain ToDo prefix');
    });

    test('Should handle different header styles', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        // Mock different header styles
        const mockConfigs = [
            { get: (key: string, def: any) => key === 'headerStyle' ? 'minimal' : config.get(key, def) },
            { get: (key: string, def: any) => key === 'headerStyle' ? 'detailed' : config.get(key, def) },
            { get: (key: string, def: any) => key === 'headerStyle' ? 'standard' : config.get(key, def) }
        ];

        for (const mockConfig of mockConfigs) {
            const template = templateManager.getHeaderBodyTemplate(mockConfig as any);
            assert.ok(template.length > 0, `Should return template for ${mockConfig.get('headerStyle', 'unknown')} style`);
        }
    });

    test('Should handle copyright configuration', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        // Test with different copyright settings
        const mockConfig = {
            get: (key: string, defaultValue?: any) => {
                if (key === 'includeLicenseHeader') return true;
                if (key === 'copyrightFormat') return 'standard';
                return config.get(key, defaultValue);
            }
        } as any;

        const template = templateManager.getHeaderBodyTemplate(mockConfig);
        const templateContent = template.join('\n');
        
        // Should include copyright when enabled
        assert.ok(templateContent.includes('Copyright') || templateContent.includes('${copyright}'), 
                 'Should include copyright when enabled');
    });

    test('Should handle project description configuration', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        const template = templateManager.getHeaderBodyTemplate(config);
        const templateContent = template.join('\n');
        
        // Should include project description placeholder
        assert.ok(templateContent.includes('${projectDescription}') || templateContent.includes('${description}'), 
                 'Should include project description placeholder');
    });

    test('Should validate template consistency', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        const headerTemplate = templateManager.getHeaderBodyTemplate(config);
        const versionTemplate = templateManager.getVersionEntryTemplate(config);
        const todoTemplate = templateManager.getTodoEntryTemplate(config);
        
        // All templates should use consistent variable naming
        const headerContent = headerTemplate.join('\n');
        
        // Check for deprecated variables (should not exist)
        assert.ok(!headerContent.includes('${company}'), 'Should not use deprecated company variable');
        
        // Check for current variables
        assert.ok(headerContent.includes('${companyName}') || headerContent.includes('${projectName}'), 
                 'Should use current variable names');
        
        // Version and todo templates should be consistent
        assert.ok(versionTemplate.includes('${comment}'), 'Version template should use comment variable');
        assert.ok(todoTemplate.includes('${comment}'), 'Todo template should use comment variable');
    });

    test('Should handle missing configuration gracefully', () => {
        // Mock empty configuration
        const emptyConfig = {
            get: (key: string, defaultValue?: any) => defaultValue
        } as any;

        // Should not throw errors with empty config
        assert.doesNotThrow(() => {
            templateManager.getHeaderBodyTemplate(emptyConfig);
            templateManager.getVersionEntryTemplate(emptyConfig);
            templateManager.getTodoEntryTemplate(emptyConfig);
        }, 'Should handle empty configuration without errors');
    });
});
