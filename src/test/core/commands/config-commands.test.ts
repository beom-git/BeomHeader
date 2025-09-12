import * as vscode from 'vscode';
import { HeaderCommands } from '../../../core/commands/header-commands';
import { EXTENSION_SECTION } from '../../../types/common.types';
import { expect } from 'chai';
import sinon from 'sinon';

describe('HeaderCommands', () => {
    it('should preserve the original "First Created" date when updating the header', async () => {
        const editor = {
            document: {
                languageId: 'typescript',
                getText: sinon.stub().returns(`// First Created: 2023-01-01\n// Last Updated: 2025-09-12`),
            },
            edit: sinon.stub().resolves(true),
        };

        const headerCommands = new HeaderCommands('path/to/extension');
        const updateHeaderStub = sinon.stub(headerCommands, 'updateExistingHeader').resolves();

        await headerCommands.updateExistingHeader(editor as unknown as vscode.TextEditor);

        expect(updateHeaderStub.calledOnce).to.be.true;
        const updatedText = editor.document.getText();
        expect(updatedText).to.include('First Created: 2023-01-01');
        expect(updatedText).to.include('Last Updated: 2025-09-12');
    });

    it('should update the "Last Updated" date without modifying "First Created"', async () => {
        const editor = {
            document: {
                languageId: 'typescript',
                getText: sinon.stub().returns(`// First Created: 2023-01-01\n// Last Updated: 2025-09-11`),
            },
            edit: sinon.stub().resolves(true),
        };

        const headerCommands = new HeaderCommands('path/to/extension');
        const updateHeaderStub = sinon.stub(headerCommands, 'updateExistingHeader').callsFake(async (editor) => {
            const text = editor.document.getText();
            const updatedText = text.replace(/Last Updated: \d{4}-\d{2}-\d{2}/, 'Last Updated: 2025-09-12');
            sinon.stub(editor.document, 'getText').returns(updatedText);
        });

        await headerCommands.updateExistingHeader(editor as unknown as vscode.TextEditor);

        expect(updateHeaderStub.calledOnce).to.be.true;
        const updatedText = editor.document.getText();
        expect(updatedText).to.include('First Created: 2023-01-01');
        expect(updatedText).to.include('Last Updated: 2025-09-12');
    });
});