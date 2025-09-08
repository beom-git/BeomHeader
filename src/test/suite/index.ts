import * as path from 'path';

export async function run(): Promise<void> {
	try {
		console.log('Starting comprehensive test runner...');
		
		// Import and run simple tests
		console.log('🔍 Running basic tests...');
		const simpleTest = await import(path.resolve(__dirname, '../simple.test.js'));
		const basicResult = await simpleTest.runTests();
		
		if (basicResult !== 0) {
			throw new Error('Basic tests failed');
		}
		
		// Import and run header insert tests
		console.log('🔍 Running header insert tests...');
		const insertHeaderTest = await import(path.resolve(__dirname, '../insertHeader.test.js'));
		const insertResult = await insertHeaderTest.runInsertHeaderTests();
		
		if (insertResult !== 0) {
			throw new Error('Header insert tests failed');
		}
		
		console.log('✅ All test suites completed successfully');
	} catch (err) {
		console.error('❌ Test runner failed:', err);
		throw err;
	}
}
