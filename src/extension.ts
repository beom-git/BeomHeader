import * as vscode from 'vscode';
import { HeaderCommands } from './core/commands/header-commands';
import { ConfigCommands } from './core/commands/config-commands';
import { ManagementCommands } from './core/commands/management-commands';
import { AutoUpdater } from './core/auto-update/auto-updater';

/**
 * Extension activation function
 */
export function activate(context: vscode.ExtensionContext): void {
  try {
    console.log('🚀 Beom Header Extension: Starting activation...');
    console.log('Extension path:', context.extensionPath);
    
    // Initialize command modules
    console.log('📦 Initializing command modules...');
    const headerCommands = new HeaderCommands(context.extensionPath);
    const configCommands = new ConfigCommands();
    const managementCommands = new ManagementCommands();
    const autoUpdater = new AutoUpdater();

    // Register all commands
    console.log('📝 Registering commands...');
    headerCommands.register(context);
    configCommands.register(context);
    managementCommands.register(context);
    
    // Register auto-update functionality
    console.log('🔄 Registering auto-update functionality...');
    autoUpdater.register(context);
    
    console.log('✅ Beom Header Extension: Activation completed successfully');
    console.log('📋 Registered commands count:', context.subscriptions.length);
    
    // Show activation success in status bar temporarily
    vscode.window.setStatusBarMessage('$(check) Beom Header Extension activated', 3000);
    
  } catch (error) {
    console.error('❌ Beom Header Extension: Activation failed', error);
    vscode.window.showErrorMessage(`Beom Header Extension activation failed: ${error}`);
  }
}

/**
 * Extension deactivation function
 */
export function deactivate(): void {
  // Cleanup if needed
}

