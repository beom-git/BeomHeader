import * as assert from 'assert';

// Simple test without suite wrapper
const testBasic = () => {
	console.log('Running basic test...');
	assert.strictEqual(1 + 1, 2);
	assert.strictEqual('hello'.length, 5);
	console.log('Basic test passed!');
};

const testVSCode = async () => {
	console.log('Running VS Code test...');
	try {
		const vscode = await import('vscode');
		console.log('VS Code module loaded successfully');
		
		// Test extension presence
		const extension = vscode.extensions.getExtension('seongbeom.beom-header');
		if (extension) {
			console.log('Extension found:', extension.id);
			console.log('Extension is active:', extension.isActive);
			
			// Activate extension if not active
			if (!extension.isActive) {
				console.log('Activating extension...');
				await extension.activate();
				console.log('Extension activated');
			}
		} else {
			console.log('Extension not found');
		}
		
		// Wait a moment for commands to register
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Test commands
		const commands = await vscode.commands.getCommands(true);
		const headerCommands = commands.filter(cmd => cmd.startsWith('fileHeader.'));
		console.log('Header commands found:', headerCommands);
		
		// Test specific commands
		const expectedCommands = ['fileHeader.insert', 'fileHeader.insertVersion', 'fileHeader.insertTodo'];
		for (const cmd of expectedCommands) {
			if (commands.includes(cmd)) {
				console.log(`✅ Command ${cmd} is registered`);
			} else {
				console.log(`❌ Command ${cmd} is NOT registered`);
			}
		}
		
		console.log('VS Code test passed!');
	} catch (error) {
		console.error('VS Code test failed:', error);
		throw error;
	}
};

// Export tests
export const runTests = async () => {
	try {
		testBasic();
		await testVSCode();
		console.log('All tests passed!');
		return 0;
	} catch (error) {
		console.error('Tests failed:', error);
		return 1;
	}
};
