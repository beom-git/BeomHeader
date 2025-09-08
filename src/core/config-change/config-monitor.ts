//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : config-monitor.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:58:53 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     Configuration change monitor for automatic header updates
//
//--------------------------------------------------------------------

import * as vscode from 'vscode';
import { HeaderCommands } from '../commands/header-commands';

export class ConfigurationMonitor {
  private headerCommands: HeaderCommands;
  private lastKnownConfig: Map<string, any> = new Map();
  
  // Settings that should trigger header update suggestions
  private headerAffectingSettings = [
    'beomHeader.projectName',
    'beomHeader.projectDescription',
    'beomHeader.companyName',
    'beomHeader.authorEmail',
    'beomHeader.authorFullName',
    'beomHeader.authorTitle',
    'beomHeader.copyrightStartYears',
    'beomHeader.copyrightNotice',
    'beomHeader.licenseType',
    'beomHeader.customLicenseText',
    'beomHeader.licenseUrl',
    'beomHeader.includeLicenseHeader',
    'beomHeader.headerStyle',
    'beomHeader.separatorLength',
    'beomHeader.separatorChar',
    'beomHeader.includeEmptyLines',
    'beomHeader.versionFormat',
    'beomHeader.customVersionFormat'
  ];

  constructor(extensionPath: string) {
    this.headerCommands = new HeaderCommands(extensionPath);
    this.initializeKnownConfig();
  }

  /**
   * Register the configuration monitor
   */
  public register(context: vscode.ExtensionContext): void {
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(
      (event) => this.handleConfigurationChange(event)
    );
    
    context.subscriptions.push(configChangeListener);
    
    // Register commands for manual header updates
    const updateAllHeadersCommand = vscode.commands.registerCommand(
      'fileHeader.updateAllHeaders',
      () => this.updateAllHeadersInWorkspace()
    );
    
    const updateCurrentHeaderCommand = vscode.commands.registerCommand(
      'fileHeader.updateCurrentHeader',
      () => this.updateCurrentFileHeader()
    );

    context.subscriptions.push(updateAllHeadersCommand, updateCurrentHeaderCommand);
  }

  /**
   * Initialize the last known configuration state
   */
  private initializeKnownConfig(): void {
    const config = vscode.workspace.getConfiguration();
    
    this.headerAffectingSettings.forEach(setting => {
      this.lastKnownConfig.set(setting, config.get(setting));
    });
  }

  /**
   * Handle configuration changes
   */
  private async handleConfigurationChange(event: vscode.ConfigurationChangeEvent): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const changedSettings: string[] = [];
    
    // Check which header-affecting settings changed
    this.headerAffectingSettings.forEach(setting => {
      if (event.affectsConfiguration(setting)) {
        const newValue = config.get(setting);
        const oldValue = this.lastKnownConfig.get(setting);
        
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          changedSettings.push(setting);
          this.lastKnownConfig.set(setting, newValue);
        }
      }
    });

    if (changedSettings.length > 0) {
      await this.suggestHeaderUpdate(changedSettings);
    }
  }

  /**
   * Suggest header update when relevant settings change
   */
  private async suggestHeaderUpdate(changedSettings: string[]): Promise<void> {
    const config = vscode.workspace.getConfiguration();
    const enableNotifications = config.get<boolean>('beomHeader.enableConfigChangeNotifications', false);
    
    if (!enableNotifications) {
      return;
    }
    
    const settingNames = changedSettings.map(s => s.replace('beomHeader.', '')).join(', ');
    
    const message = `Header configuration changed (${settingNames}). Would you like to update existing headers?`;
    
    const choice = await vscode.window.showInformationMessage(
      message,
      'Update Current File',
      'Update All Files',
      'Not Now',
      'Disable Notifications'
    );

    switch (choice) {
      case 'Update Current File':
        await this.updateCurrentFileHeader();
        break;
      case 'Update All Files':
        await this.updateAllHeadersInWorkspace();
        break;
      case 'Disable Notifications':
        await config.update('beomHeader.enableConfigChangeNotifications', false, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
          'Configuration change notifications disabled. You can re-enable them in settings or use manual update commands.'
        );
        break;
      case 'Not Now':
        // Show how to manually update later
        vscode.window.showInformationMessage(
          'You can update headers manually using "File Header: Update Current Header" or "File Header: Update All Headers" commands.'
        );
        break;
    }
  }

  /**
   * Update header in the current file
   */
  private async updateCurrentFileHeader(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found.');
      return;
    }

    try {
      await this.headerCommands.updateExistingHeader(editor);
      vscode.window.showInformationMessage('Header updated successfully.');
    } catch (error) {
      console.error('Error updating current file header:', error);
      vscode.window.showErrorMessage(`Failed to update header: ${error}`);
    }
  }

  /**
   * Update headers in all files in the workspace
   */
  private async updateAllHeadersInWorkspace(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showWarningMessage('No workspace folder found.');
      return;
    }

    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Updating headers in workspace files...',
        cancellable: true
      }, async (progress, token) => {
        let updatedCount = 0;
        let totalFiles = 0;
        
        // Find all relevant files
        const config = vscode.workspace.getConfiguration();
        const excludePatterns = config.get<string[]>('beomHeader.excludePatterns', []);
        
        // Common file patterns to include
        const includePatterns = [
          '**/*.{js,ts,jsx,tsx,py,java,c,cpp,h,hpp,cs,php,rb,go,rs,swift,kt,scala}',
          '**/*.{sh,bash,zsh,fish,ps1,bat,cmd}',
          '**/*.{sql,html,css,scss,sass,less,xml,yaml,yml,json}',
          '**/*.{r,m,pl,lua,tcl,vim,asm,s,S,f,f90,f95,for,pas,cob,cbl}'
        ];

        for (const pattern of includePatterns) {
          if (token.isCancellationRequested) {
            break;
          }

          const files = await vscode.workspace.findFiles(pattern, null, 1000);
          totalFiles += files.length;

          for (const file of files) {
            if (token.isCancellationRequested) {
              break;
            }

            // Check if file should be excluded
            const relativePath = vscode.workspace.asRelativePath(file);
            const shouldExclude = excludePatterns.some(pattern => {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(relativePath);
            });

            if (shouldExclude) {
              continue;
            }

            try {
              const document = await vscode.workspace.openTextDocument(file);
              const editor = await vscode.window.showTextDocument(document, { preview: true, preserveFocus: true });
              
              const hasHeader = await this.headerCommands.hasExistingHeader(editor);
              if (hasHeader) {
                await this.headerCommands.updateExistingHeader(editor);
                updatedCount++;
              }

              progress.report({
                message: `Updated ${updatedCount} of ${totalFiles} files`,
                increment: (1 / totalFiles) * 100
              });
              
              // Small delay to prevent overwhelming the system
              await new Promise(resolve => setTimeout(resolve, 50));
              
            } catch (error) {
              console.error(`Error updating header in ${file.fsPath}:`, error);
              // Continue with other files
            }
          }
        }

        return updatedCount;
      });

      const resultCount = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Updating headers in workspace files...',
        cancellable: true
      }, async (progress, token) => {
        let updatedCount = 0;
        let totalFiles = 0;
        
        // Find all relevant files
        const config = vscode.workspace.getConfiguration();
        const excludePatterns = config.get<string[]>('beomHeader.excludePatterns', []);
        
        // Common file patterns to include
        const includePatterns = [
          '**/*.{js,ts,jsx,tsx,py,java,c,cpp,h,hpp,cs,php,rb,go,rs,swift,kt,scala}',
          '**/*.{sh,bash,zsh,fish,ps1,bat,cmd}',
          '**/*.{sql,html,css,scss,sass,less,xml,yaml,yml,json}',
          '**/*.{r,m,pl,lua,tcl,vim,asm,s,S,f,f90,f95,for,pas,cob,cbl}'
        ];

        for (const pattern of includePatterns) {
          if (token.isCancellationRequested) {
            break;
          }

          const files = await vscode.workspace.findFiles(pattern, null, 1000);
          totalFiles += files.length;

          for (const file of files) {
            if (token.isCancellationRequested) {
              break;
            }

            // Check if file should be excluded
            const relativePath = vscode.workspace.asRelativePath(file);
            const shouldExclude = excludePatterns.some(pattern => {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(relativePath);
            });

            if (shouldExclude) {
              continue;
            }

            try {
              const document = await vscode.workspace.openTextDocument(file);
              const editor = await vscode.window.showTextDocument(document, { preview: true, preserveFocus: true });
              
              const hasHeader = await this.headerCommands.hasExistingHeader(editor);
              if (hasHeader) {
                await this.headerCommands.updateExistingHeader(editor);
                updatedCount++;
              }

              progress.report({
                message: `Updated ${updatedCount} of ${totalFiles} files`,
                increment: (1 / totalFiles) * 100
              });
              
              // Small delay to prevent overwhelming the system
              await new Promise(resolve => setTimeout(resolve, 50));
              
            } catch (error) {
              console.error(`Error updating header in ${file.fsPath}:`, error);
              // Continue with other files
            }
          }
        }

        return updatedCount;
      });

      vscode.window.showInformationMessage(`Updated headers in ${resultCount} files.`);
      
    } catch (error) {
      console.error('Error updating workspace headers:', error);
      vscode.window.showErrorMessage(`Failed to update workspace headers: ${error}`);
    }
  }
}
