import * as assert from 'assert';
import * as vscode from 'vscode';
import { VariableResolver } from '../../../core/templates/variable-resolver';

suite('Variable Resolver Test Suite', () => {
    test('should resolve variables correctly', () => {
        const resolver = new VariableResolver();
        
        const mockDocument = {
            languageId: 'typescript',
            fileName: 'test.ts',
            uri: { fsPath: '/path/to/test.ts' }
        } as vscode.TextDocument;

        const mockConfig = {
            get: (key: string, defaultValue?: any) => {
                if (key === 'projectName') return 'MyProject';
                if (key === 'authorFullName') return 'John Doe';
                return defaultValue || '<Error>';
            }
        } as vscode.WorkspaceConfiguration;

        const variables = resolver.resolveVariables(mockDocument, mockConfig, '/extension/path');

        assert.strictEqual(variables.projectName, 'MyProject');
        assert.strictEqual(variables.author, 'John Doe');
        assert.ok(variables.comment);
        assert.ok(variables.separator);
    });

    test('should interpolate template with variables', () => {
        const resolver = new VariableResolver();
        const variables = {
            projectName: 'MyProject',
            author: 'John Doe'
        };

        const result = resolver.interpolateTemplate('${projectName} by ${author}', variables as any);
        assert.strictEqual(result, 'MyProject by John Doe');
    });
});