//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : variable-resolver.test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 07:35:25 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test suite for variable resolver functionality
//        o Test configuration value resolution
//        o Test error fallback values
//        o Test template variable consistency
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as assert from 'assert';
import * as vscode from 'vscode';
import { VariableResolver } from '../core/templates/variable-resolver';

suite('Variable Resolver Test Suite', () => {
    let variableResolver: VariableResolver;
    let testDocument: vscode.TextDocument;
    let originalConfig: vscode.WorkspaceConfiguration;

    setup(async () => {
        variableResolver = new VariableResolver();
        
        // Create a test document
        testDocument = await vscode.workspace.openTextDocument({
            content: 'console.log("test");',
            language: 'typescript'
        });

        // Store original configuration
        originalConfig = vscode.workspace.getConfiguration('beomHeader');
    });

    teardown(async () => {
        // Clean up
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Should resolve basic variables correctly', async () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        
        const variables = variableResolver.resolveVariables(testDocument, config, extensionPath);

        // Check basic variables
        assert.ok(variables.fileName, 'Should have fileName variable');
        assert.ok(variables.author, 'Should have author variable');
        assert.ok(variables.today, 'Should have today variable');
        assert.ok(variables.comment, 'Should have comment variable');
        assert.ok(variables.companyName, 'Should have companyName variable');
    });

    test('Should use error fallback for missing configuration', async () => {
        // Create a minimal config without values
        const mockConfig = {
            get: (key: string, defaultValue?: any) => {
                // Return undefined for most keys to test error fallback
                if (key === 'author') return undefined;
                if (key === 'companyName') return undefined;
                if (key === 'projectName') return undefined;
                return defaultValue;
            }
        } as any;

        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        const variables = variableResolver.resolveVariables(testDocument, mockConfig, extensionPath);

        // These should fall back to <Error>
        assert.strictEqual(variables.author, '<Error>', 'Should use error fallback for missing author');
        assert.strictEqual(variables.companyName, '<Error>', 'Should use error fallback for missing companyName');
        assert.strictEqual(variables.projectName, '<Error>', 'Should use error fallback for missing projectName');
    });

    test('Should handle template variable consistency', async () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        
        const documentVariables = variableResolver.resolveVariables(testDocument, config, extensionPath);

        // Should have companyName (no more company alias)
        assert.ok(documentVariables.companyName, 'Document variables should have companyName');
        
        // Should not have deprecated company field
        assert.strictEqual((documentVariables as any).company, undefined, 'Should not have deprecated company field');
    });

    test('Should resolve project description correctly', async () => {
        // Test with configured project description
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        // Mock config with project description
        const mockConfig = {
            get: (key: string, defaultValue?: any) => {
                if (key === 'projectDescription') return 'Test Project Description';
                if (key === 'author') return 'Test Author';
                if (key === 'companyName') return 'Test Company';
                return config.get(key, defaultValue);
            }
        } as any;

        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        const variables = variableResolver.resolveVariables(testDocument, mockConfig, extensionPath);

        assert.strictEqual(variables.projectDescription, 'Test Project Description', 'Should resolve project description');
        assert.strictEqual(variables.description, 'Test Project Description', 'Should have description alias');
    });

    test('Should handle copyright start years correctly', async () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        
        // Mock config with copyright start years
        const mockConfig = {
            get: (key: string, defaultValue?: any) => {
                if (key === 'copyrightStartYears') return { 'default': 2023, 'project1': 2022 };
                return config.get(key, defaultValue);
            }
        } as any;

        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        const variables = variableResolver.resolveVariables(testDocument, mockConfig, extensionPath);

        // Should resolve copyright years correctly
        assert.ok(variables.copyrightYears, 'Should have copyright years');
        assert.ok(variables.copyrightYears.includes('2023'), 'Should include start year in copyright');
    });

    test('Should interpolate templates correctly', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        const variables = variableResolver.resolveVariables(testDocument, config, extensionPath);

        const template = '${comment} Author: ${author}';
        const result = variableResolver.interpolateTemplate(template, variables);
        
        assert.ok(result.includes('Author:'), 'Should interpolate template correctly');
        assert.ok(result.includes(variables.comment), 'Should include comment token');
        assert.ok(result.includes(variables.author), 'Should include author');
    });

    test('Should handle missing variables in templates', () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        const variables = variableResolver.resolveVariables(testDocument, config, extensionPath);

        const template = '${comment} Author: ${nonExistentVariable}';
        const result = variableResolver.interpolateTemplate(template, variables);
        
        assert.ok(result.includes('Author:'), 'Should process existing variables');
        assert.ok(result.includes('${nonExistentVariable}'), 'Should leave missing variables unchanged');
    });

    test('Should resolve file-specific variables', async () => {
        // Create a document with a specific name
        const namedDoc = await vscode.workspace.openTextDocument({
            content: 'console.log("test");',
            language: 'javascript'
        });

        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        
        const variables = variableResolver.resolveVariables(namedDoc, config, extensionPath);

        // Check file-specific variables
        assert.ok(variables.fileName, 'Should resolve file name');
        assert.strictEqual(variables.comment, '//', 'Should resolve correct comment token for JavaScript');
        
        // Clean up
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Should handle version formatting correctly', async () => {
        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        
        const variables = variableResolver.resolveVariables(testDocument, config, extensionPath);

        // Should have version-related variables
        assert.ok(variables.version !== undefined, 'Should have version variable');
        assert.ok(variables.major !== undefined, 'Should have major version variable');
        assert.ok(variables.patch !== undefined, 'Should have patch version variable');
    });

    test('Should handle different language comment tokens', async () => {
        // Test Python
        const pythonDoc = await vscode.workspace.openTextDocument({
            content: 'print("test")',
            language: 'python'
        });

        const config = vscode.workspace.getConfiguration('beomHeader');
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        
        let variables = variableResolver.resolveVariables(pythonDoc, config, extensionPath);
        assert.strictEqual(variables.comment, '#', 'Should use # for Python');

        // Test CSS
        const cssDoc = await vscode.workspace.openTextDocument({
            content: 'body { color: red; }',
            language: 'css'
        });

        variables = variableResolver.resolveVariables(cssDoc, config, extensionPath);
        assert.strictEqual(variables.comment, '/*', 'Should use /* for CSS');

        // Clean up
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
});
