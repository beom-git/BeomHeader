//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : string-utils.test.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 07:35:25 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Test suite for string utility functions
//        o Test template interpolation
//        o Test number padding
//        o Test separator generation
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

import * as assert from 'assert';
import { interpolateTemplate, padNumber, generateSeparator } from '../utils/string-utils';

suite('String Utils Test Suite', () => {

    test('Should interpolate templates correctly', () => {
        const template = 'Hello ${name}, today is ${date}';
        const variables = {
            name: 'World',
            date: '2025-09-08'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Hello World, today is 2025-09-08', 'Should interpolate all variables');
    });

    test('Should handle missing variables in templates', () => {
        const template = 'Hello ${name}, today is ${missingDate}';
        const variables = {
            name: 'World'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Hello World, today is ${missingDate}', 'Should leave missing variables unchanged');
    });

    test('Should handle empty template', () => {
        const template = '';
        const variables = { name: 'World' };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, '', 'Should handle empty template');
    });

    test('Should handle template with no variables', () => {
        const template = 'Hello World';
        const variables = { name: 'Test' };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Hello World', 'Should return template unchanged if no variables');
    });

    test('Should handle nested braces', () => {
        const template = 'Data: {${data}}';
        const variables = { data: 'test' };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Data: {test}', 'Should handle nested braces correctly');
    });

    test('Should pad numbers correctly', () => {
        assert.strictEqual(padNumber(5, 2), '05', 'Should pad single digit with zero');
        assert.strictEqual(padNumber(15, 2), '15', 'Should not pad when length is sufficient');
        assert.strictEqual(padNumber(5, 3), '005', 'Should pad with multiple zeros');
        assert.strictEqual(padNumber(123, 2), '123', 'Should not truncate when number is longer');
    });

    test('Should handle zero padding', () => {
        assert.strictEqual(padNumber(0, 2), '00', 'Should pad zero correctly');
        assert.strictEqual(padNumber(0, 1), '0', 'Should handle single digit padding for zero');
    });

    test('Should handle negative numbers in padding', () => {
        assert.strictEqual(padNumber(-5, 3), '-05', 'Should handle negative numbers');
        assert.strictEqual(padNumber(-15, 3), '-15', 'Should handle negative numbers with sufficient length');
    });

    test('Should generate separator correctly', () => {
        const separator = generateSeparator('//', 60);
        
        assert.ok(separator.startsWith('//'), 'Should start with comment token');
        assert.ok(separator.includes('-'), 'Should contain dashes');
        assert.strictEqual(separator.length, 60, 'Should have correct total length');
    });

    test('Should generate separator with different comment tokens', () => {
        const cppSeparator = generateSeparator('//', 50);
        const pythonSeparator = generateSeparator('#', 50);
        const cssSeparator = generateSeparator('/*', 50);

        assert.ok(cppSeparator.startsWith('//'), 'Should handle C++ style comments');
        assert.ok(pythonSeparator.startsWith('#'), 'Should handle Python style comments');
        assert.ok(cssSeparator.startsWith('/*'), 'Should handle CSS style comments');
        
        assert.strictEqual(cppSeparator.length, 50, 'C++ separator should have correct length');
        assert.strictEqual(pythonSeparator.length, 50, 'Python separator should have correct length');
        assert.strictEqual(cssSeparator.length, 50, 'CSS separator should have correct length');
    });

    test('Should handle short separator lengths', () => {
        const shortSeparator = generateSeparator('//', 10);
        
        assert.strictEqual(shortSeparator.length, 10, 'Should handle short lengths');
        assert.ok(shortSeparator.startsWith('//'), 'Should still start with comment token');
    });

    test('Should handle very short lengths gracefully', () => {
        const veryShort = generateSeparator('//', 3);
        
        // Should not throw error and return at least the comment token
        assert.ok(veryShort.length >= 2, 'Should return at least comment token length');
        assert.ok(veryShort.startsWith('//'), 'Should start with comment token');
    });

    test('Should handle complex variable names', () => {
        const template = '${user.name} works at ${company.name}';
        const variables = {
            'user.name': 'John Doe',
            'company.name': 'Tech Corp'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'John Doe works at Tech Corp', 'Should handle complex variable names');
    });

    test('Should handle special characters in variables', () => {
        const template = 'Path: ${filePath}';
        const variables = {
            filePath: '/home/user/my-project/file.ts'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Path: /home/user/my-project/file.ts', 'Should handle special characters');
    });

    test('Should be case sensitive for variables', () => {
        const template = '${Name} vs ${name}';
        const variables = {
            name: 'lowercase',
            Name: 'Uppercase'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'Uppercase vs lowercase', 'Should be case sensitive');
    });

    test('Should handle multiple occurrences of same variable', () => {
        const template = '${name} said "${name}" twice';
        const variables = {
            name: 'John'
        };

        const result = interpolateTemplate(template, variables);
        assert.strictEqual(result, 'John said "John" twice', 'Should replace all occurrences');
    });
});
