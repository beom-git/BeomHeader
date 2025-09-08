import * as assert from 'assert';
import * as vscode from 'vscode';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Extension should be present', () => {
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		assert.ok(extension, 'Extension should be present');
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		assert.ok(extension, 'Extension should be present');
		
		if (!extension.isActive) {
			await extension.activate();
		}
		assert.ok(extension.isActive, 'Extension should be active');
	});

	test('Commands should be registered', async () => {
		// Wait a bit for extension to fully load
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('fileHeader.insert'), 'fileHeader.insert command should be registered');
		assert.ok(commands.includes('fileHeader.insertVersion'), 'fileHeader.insertVersion command should be registered');
		assert.ok(commands.includes('fileHeader.insertTodo'), 'fileHeader.insertTodo command should be registered');
	});

	test('Configuration should be accessible', () => {
		const config = vscode.workspace.getConfiguration('beomHeader');
		assert.ok(config, 'Configuration should be accessible');
	});
});
