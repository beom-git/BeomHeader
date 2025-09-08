//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : TCL
// File Name     : extension.ts
// Author        : Seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 05:08:08 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module provides core functionality for the TCL application
//        o 
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  Seongbeom) First Release by 'Seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, Seongbeom) None
//--------------------------------------------------------------------

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

