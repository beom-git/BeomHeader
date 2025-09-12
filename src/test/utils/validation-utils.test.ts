import * as assert from 'assert';
import { 
    validateLanguageId, 
    validateCommentToken, 
    validateEmail, 
    validateUrl, 
    validateCopyrightNotice, 
    validateProjectDescription, 
    validateSeparatorLength, 
    validateYearInput 
} from '../../utils/validation-utils';

suite('Validation Utils Test Suite', () => {
    test('should validate language ID correctly', () => {
        assert.ok(validateLanguageId('typescript').isValid);
        assert.ok(validateLanguageId('cpp-header').isValid);
        assert.ok(!validateLanguageId('').isValid);
        assert.ok(!validateLanguageId('   ').isValid);
    });

    test('should validate comment token correctly', () => {
        assert.ok(validateCommentToken('//').isValid);
        assert.ok(validateCommentToken('#').isValid);
        assert.ok(!validateCommentToken('').isValid);
        assert.ok(!validateCommentToken('   ').isValid);
    });

    test('should validate email correctly', () => {
        assert.ok(validateEmail('user@example.com').isValid);
        assert.ok(validateEmail('').isValid); // Empty is allowed
        assert.ok(!validateEmail('invalid-email').isValid);
    });

    test('should validate URL correctly', () => {
        assert.ok(validateUrl('https://example.com').isValid);
        assert.ok(validateUrl('http://example.com').isValid);
        assert.ok(validateUrl('').isValid); // Empty is allowed
        assert.ok(!validateUrl('invalid-url').isValid);
    });

    test('should validate copyright notice correctly', () => {
        assert.ok(validateCopyrightNotice('Copyright 2023').isValid);
        assert.ok(!validateCopyrightNotice('').isValid);
        assert.ok(!validateCopyrightNotice('   ').isValid);
    });

    test('should validate project description correctly', () => {
        assert.ok(validateProjectDescription('My Project Description').isValid);
        assert.ok(!validateProjectDescription('').isValid);
        assert.ok(!validateProjectDescription('   ').isValid);
    });

    test('should validate separator length correctly', () => {
        assert.ok(validateSeparatorLength('50').isValid);
        assert.ok(validateSeparatorLength('10').isValid);
        assert.ok(validateSeparatorLength('200').isValid);
        assert.ok(!validateSeparatorLength('5').isValid);
        assert.ok(!validateSeparatorLength('250').isValid);
        assert.ok(!validateSeparatorLength('invalid').isValid);
    });

    test('should validate year input correctly', () => {
        assert.ok(validateYearInput('2023').isValid);
        assert.ok(!validateYearInput('1899').isValid);
        assert.ok(!validateYearInput('invalid').isValid);
        assert.ok(!validateYearInput('3000').isValid);
    });
});
