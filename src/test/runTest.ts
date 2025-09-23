//--------------------------------------------------------------------
// (C) Copyright 2023-2025 supergate
//
// All Rights Reserved
//
// Project Name  : CSS Application
// File Name     : runTest.ts
// Author        : seongbeom - SoC Designer <seongbeom@supergate.cc>
// First Created : 2025/09/12
// Last Updated  : 2025-09-12 06:56:35 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module provides core functionality for the CSS Application application
//        o 
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/12 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/09/12 : (ToDo#00, seongbeom) None
//--------------------------------------------------------------------
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ 
			extensionDevelopmentPath, 
			extensionTestsPath,
			launchArgs: [
				'--disable-extensions',
				'--disable-gpu',
				'--no-sandbox',
				'--disable-dev-shm-usage'
			]
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
