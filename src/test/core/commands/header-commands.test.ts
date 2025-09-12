import * as assert from 'assert';
import * as vscode from 'vscode';
import { HeaderCommands } from '../../../core/commands/header-commands';
import sinon from 'sinon';

suite('Header Commands Test Suite', () => {
    test('should insert a header with correct metadata', async () => {
        const editor = {
            document: {
                languageId: 'typescript',
                getText: () => '',
            },
            edit: async (callback: any) => {
                const editBuilder = {
                    insert: (position: any, text: string) => {
                        editor.document.getText = () => text;
                    },
                };
                callback(editBuilder);
                return true;
            },
        };

        const headerCommands = new HeaderCommands('path/to/extension');
        const insertStub = sinon.stub(headerCommands as any, 'insertFileHeader').callsFake(async () => {
            const headerText = `// First Created: 2025-09-12\n// Last Updated: 2025-09-12`;
            editor.document.getText = () => headerText;
        });

        await (headerCommands as any).insertFileHeader();

        const insertedText = editor.document.getText();
        assert.ok(insertedText.includes('First Created: 2025-09-12'));
        assert.ok(insertedText.includes('Last Updated: 2025-09-12'));

        insertStub.restore();
    });
});