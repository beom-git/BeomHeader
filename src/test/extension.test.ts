import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { HeaderCommands } from '../core/commands/header-commands';
import { TemplateManager } from '../core/templates/template-manager';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let testDocument: vscode.TextDocument;
	let testEditor: vscode.TextEditor;

	// Setup before each test
	setup(async () => {
		// Create a test document
		testDocument = await vscode.workspace.openTextDocument({
			content: '',
			language: 'typescript'
		});
		testEditor = await vscode.window.showTextDocument(testDocument);
	});

	// Cleanup after each test
	teardown(async () => {
		if (testEditor) {
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		}
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('seongbeom.beom-header'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		assert.ok(extension);
		
		if (!extension.isActive) {
			await extension.activate();
		}
		assert.ok(extension.isActive);
	});

	test('fileHeader.insert command should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('fileHeader.insert'), 'fileHeader.insert command should be registered');
		assert.ok(commands.includes('fileHeader.insertVersion'), 'fileHeader.insertVersion command should be registered');
		assert.ok(commands.includes('fileHeader.insertTodo'), 'fileHeader.insertTodo command should be registered');
	});

	test('HeaderCommands class should initialize properly', () => {
		const mockExtensionPath = '/mock/path';
		const headerCommands = new HeaderCommands(mockExtensionPath);
		assert.ok(headerCommands, 'HeaderCommands should initialize');
	});

	test('fileHeader.insert should execute without error', async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		// Execute the command
		try {
			await vscode.commands.executeCommand('fileHeader.insert');
			// If we get here, the command executed without throwing
			assert.ok(true, 'Command executed without error');
		} catch (error) {
			assert.fail(`Command execution failed: ${error}`);
		}
	});

	test('fileHeader.insert should insert header content', async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		// Clear the document first
		await testEditor.edit(editBuilder => {
			const fullRange = new vscode.Range(
				testDocument.positionAt(0),
				testDocument.positionAt(testDocument.getText().length)
			);
			editBuilder.delete(fullRange);
		});

		// Execute the insert command
		await vscode.commands.executeCommand('fileHeader.insert');

		// Check if content was inserted
		const content = testDocument.getText();
		assert.ok(content.length > 0, 'Header content should be inserted');
		assert.ok(content.includes('//'), 'Header should contain comment tokens');
	});

	test('fileHeader.insert should prevent duplicate insertion', async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		// Insert header first time
		await vscode.commands.executeCommand('fileHeader.insert');
		const firstContent = testDocument.getText();
		const firstLength = firstContent.length;

		// Try to insert again
		await vscode.commands.executeCommand('fileHeader.insert');
		const secondContent = testDocument.getText();
		const secondLength = secondContent.length;

		// Content should not change significantly (only minimal change expected)
		assert.strictEqual(firstLength, secondLength, 'Header should not be duplicated');
	});

	test('TemplateManager should be accessible', () => {
		const mockPath = '/mock/extension/path';
		const templateManager = TemplateManager.getInstance(mockPath);
		assert.ok(templateManager, 'TemplateManager should be accessible');
	});

	test('fileHeader.insertVersion should execute without error', async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		try {
			await vscode.commands.executeCommand('fileHeader.insertVersion');
			assert.ok(true, 'insertVersion command executed without error');
		} catch (error) {
			assert.fail(`insertVersion command execution failed: ${error}`);
		}
	});

	test('fileHeader.insertTodo should execute without error', async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		try {
			await vscode.commands.executeCommand('fileHeader.insertTodo');
			assert.ok(true, 'insertTodo command executed without error');
		} catch (error) {
			assert.fail(`insertTodo command execution failed: ${error}`);
		}
	});

	test('Configuration should be accessible', () => {
		const config = vscode.workspace.getConfiguration('beomHeader');
		assert.ok(config, 'Configuration should be accessible');
		
		// Test some default configuration values
		const projectName = config.get('projectName');
		const company = config.get('company');
		assert.ok(typeof projectName === 'string', 'projectName should be a string');
		assert.ok(typeof company === 'string', 'company should be a string');
	});

	test('Language detection should work', async () => {
		// Test with different language documents
		const jsDocument = await vscode.workspace.openTextDocument({
			content: '',
			language: 'javascript'
		});
		assert.strictEqual(jsDocument.languageId, 'javascript');

		const pyDocument = await vscode.workspace.openTextDocument({
			content: '',
			language: 'python'
		});
		assert.strictEqual(pyDocument.languageId, 'python');

		// Close test documents
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Sample test (original)', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
