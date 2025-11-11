//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : runTest.ts
// Author        : seongbeom
// First Created : 2025/11/07
// Last Updated  : 2025-11-07 03:46:28 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test runner entry point
//        o Initializes Mocha test environment
//        o Discovers and runs all test files
//        o Reports test results
//
//----------------------------------------------------------------------

import * as path from 'path';
import Mocha from 'mocha';
import { globSync } from 'glob';

/**
 * Run all tests
 */
export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'bdd',
    color: true,
    reporter: 'spec',
    timeout: 10000,
    slow: 3000
  });

  const testsRoot = path.resolve(__dirname);

  return new Promise((resolve, reject) => {
    try {
      const files = globSync('**/*.test.js', { cwd: testsRoot });

      // Add each test file to the mocha instance
      files.forEach(file => {
        mocha.addFile(path.resolve(testsRoot, file));
      });

      // Run the mocha test suite
      mocha.run(failures => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed`));
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

