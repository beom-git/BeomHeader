//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : header-commands.test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 07:35:25 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test suite for header commands functionality
//        o Test header insertion
//        o Test header update with content preservation
//        o Test version and todo entry insertion
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as assert from 'assert';
import * as vscode from 'vscode';
import { HeaderCommands } from '../core/commands/header-commands';

suite('Header Commands Test Suite', () => {
    let headerCommands: HeaderCommands;
    let testDocument: vscode.TextDocument;
    let testEditor: vscode.TextEditor;

    setup(async () => {
        // Initialize header commands
        const extensionPath = vscode.extensions.getExtension('seongbeom.beom-header')?.extensionPath || '';
        headerCommands = new HeaderCommands(extensionPath);
        
        // Create a test document
        testDocument = await vscode.workspace.openTextDocument({
            content: '',
            language: 'typescript'
        });
        testEditor = await vscode.window.showTextDocument(testDocument);
    });

    teardown(async () => {
        // Clean up
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Should detect existing header correctly', async () => {
        // Test with no header
        let hasHeader = await headerCommands.hasExistingHeader(testEditor);
        assert.strictEqual(hasHeader, false, 'Should not detect header in empty document');

        // Add a header
        const headerContent = `//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//--------------------------------------------------------------------`;

        await testEditor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), headerContent);
        });

        // Test with header
        hasHeader = await headerCommands.hasExistingHeader(testEditor);
        assert.strictEqual(hasHeader, true, 'Should detect existing header');
    });

    test('Should extract header content correctly', async () => {
        // Create a test header with custom content
        const headerWithContent = `//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:36:43 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This is a custom description
//     that spans multiple lines
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release
//      * 2025/09/07 : (v01p01,  Seongbeom) Added new feature
// To-Do List   :
//      * 2025/09/08 : (ToDo#01, Seongbeom) Fix bug in parser
//      * 2025/09/08 : (ToDo#02, Seongbeom) Add error handling
//--------------------------------------------------------------------

console.log('test');`;

        await testEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(0, 0, testDocument.lineCount, 0), headerWithContent);
        });

        // Use reflection to access private method for testing
        const extractMethod = (headerCommands as any).extractHeaderContent;
        const findBoundsMethod = (headerCommands as any).findHeaderBounds;
        
        const headerBounds = findBoundsMethod.call(headerCommands, testDocument, '//');
        const extractedContent = extractMethod.call(headerCommands, testDocument, headerBounds, '//');

        // Verify extracted content
        assert.ok(extractedContent.description.length > 0, 'Should extract description content');
        assert.ok(extractedContent.fileHistory.length > 0, 'Should extract file history content');
        assert.ok(extractedContent.todoList.length > 0, 'Should extract todo list content');

        // Check specific content
        const descriptionText = extractedContent.description.join('\n');
        assert.ok(descriptionText.includes('custom description'), 'Should contain custom description text');
        
        const fileHistoryText = extractedContent.fileHistory.join('\n');
        assert.ok(fileHistoryText.includes('First Release'), 'Should contain file history entries');
        assert.ok(fileHistoryText.includes('Added new feature'), 'Should contain multiple file history entries');
        
        const todoText = extractedContent.todoList.join('\n');
        assert.ok(todoText.includes('Fix bug in parser'), 'Should contain todo entries');
        assert.ok(todoText.includes('Add error handling'), 'Should contain multiple todo entries');
    });

    test('Should preserve existing content during header update', async () => {
        // Create initial header with custom content
        const initialHeader = `//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:36:43 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Original custom description
//     with multiple lines
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) Original entry
// To-Do List   :
//      * 2025/09/08 : (ToDo#01, Seongbeom) Original todo
//--------------------------------------------------------------------

console.log('test');`;

        await testEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(0, 0, testDocument.lineCount, 0), initialHeader);
        });

        // Mock the template manager and variable resolver to return predictable results
        const preserveMethod = (headerCommands as any).preserveExistingContent;
        const extractMethod = (headerCommands as any).extractHeaderContent;
        const findBoundsMethod = (headerCommands as any).findHeaderBounds;

        // Extract existing content
        const headerBounds = findBoundsMethod.call(headerCommands, testDocument, '//');
        const existingContent = extractMethod.call(headerCommands, testDocument, headerBounds, '//');

        // Create a new header template (simulating what would come from template manager)
        const newHeaderTemplate = `//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 06:00:00 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     <Error>
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) Description
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) Description
//--------------------------------------------------------------------`;

        // Preserve existing content
        const preservedHeader = preserveMethod.call(headerCommands, newHeaderTemplate, existingContent, '//');

        // Verify that existing content is preserved
        assert.ok(preservedHeader.includes('Original custom description'), 'Should preserve original description');
        assert.ok(preservedHeader.includes('Original entry'), 'Should preserve original file history');
        assert.ok(preservedHeader.includes('Original todo'), 'Should preserve original todo');
        
        // Verify that other fields are updated
        assert.ok(preservedHeader.includes('06:00:00'), 'Should update timestamp');
    });

    test('Should handle empty sections correctly', async () => {
        // Test with empty sections
        const headerWithEmptySections = `//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:36:43 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     <Error>
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) Description
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) Description
//--------------------------------------------------------------------`;

        await testEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(0, 0, testDocument.lineCount, 0), headerWithEmptySections);
        });

        const extractMethod = (headerCommands as any).extractHeaderContent;
        const findBoundsMethod = (headerCommands as any).findHeaderBounds;
        
        const headerBounds = findBoundsMethod.call(headerCommands, testDocument, '//');
        const extractedContent = extractMethod.call(headerCommands, testDocument, headerBounds, '//');

        // Should handle empty/template sections
        assert.strictEqual(extractedContent.description.length, 0, 'Should not extract template description');
        assert.strictEqual(extractedContent.fileHistory.length, 0, 'Should not extract template file history');
        assert.strictEqual(extractedContent.todoList.length, 0, 'Should not extract template todo list');
    });

    test('Should find header boundaries correctly', async () => {
        const headerContent = `//--------------------------------------------------------------------
// Header content
//--------------------------------------------------------------------
console.log('after header');`;

        await testEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(0, 0, testDocument.lineCount, 0), headerContent);
        });

        const findBoundsMethod = (headerCommands as any).findHeaderBounds;
        const bounds = findBoundsMethod.call(headerCommands, testDocument, '//');

        assert.ok(bounds, 'Should find header bounds');
        assert.strictEqual(bounds.start, 0, 'Should start at line 0');
        assert.strictEqual(bounds.end, 2, 'Should end at correct line');
    });

    test('Should handle documents without headers', async () => {
        const nonHeaderContent = `console.log('no header here');
function test() {
    return true;
}`;

        await testEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(0, 0, testDocument.lineCount, 0), nonHeaderContent);
        });

        const findBoundsMethod = (headerCommands as any).findHeaderBounds;
        const bounds = findBoundsMethod.call(headerCommands, testDocument, '//');

        assert.strictEqual(bounds, null, 'Should return null for documents without headers');
    });

    test('Should handle different comment tokens', async () => {
        // Create a Python document
        const pythonDoc = await vscode.workspace.openTextDocument({
            content: '',
            language: 'python'
        });
        const pythonEditor = await vscode.window.showTextDocument(pythonDoc);

        const pythonHeader = `#--------------------------------------------------------------------
# Python header
#--------------------------------------------------------------------`;

        await pythonEditor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), pythonHeader);
        });

        const hasHeader = await headerCommands.hasExistingHeader(pythonEditor);
        assert.strictEqual(hasHeader, true, 'Should detect header with different comment token');

        // Clean up Python editor
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
});
