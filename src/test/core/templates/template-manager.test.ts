import * as assert from 'assert';
import * as vscode from 'vscode';
import { TemplateManager } from '../../../core/templates/template-manager';

suite('Template Manager Test Suite', () => {
    test('should get header body template correctly', () => {
        const templateManager = TemplateManager.getInstance('/test/extension/path');
        
        const mockConfig = {
            get: () => 'standard'
        } as any;

        const template = templateManager.getHeaderBodyTemplate(mockConfig);

        assert.ok(Array.isArray(template));
        assert.ok(template.length > 0);
        assert.ok(template[0].includes('${comment}'));
    });

    test('should get available styles', () => {
        const templateManager = TemplateManager.getInstance('/test/extension/path');
        const styles = templateManager.getAvailableStyles();

        assert.ok(Array.isArray(styles), 'Styles should be an array');
        assert.ok(styles.includes('standard'), 'Should include standard style');
        assert.ok(styles.includes('minimal'), 'Should include minimal style');
        assert.ok(styles.includes('detailed'), 'Should include detailed style');
    });

    test('should get version entry template', () => {
        const templateManager = TemplateManager.getInstance('/test/extension/path');
        
        const mockConfig = {
            get: () => 'standard'
        } as any;

        const template = templateManager.getVersionEntryTemplate(mockConfig);

        assert.ok(typeof template === 'string');
        assert.ok(template.includes('${comment}'));
    });
});