//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : extension.ts
// Author        : seongbeom
// First Created : 2025/05/07
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file contains the main entry point for the Beom Header extension.
//        o Registers all extension commands
//        o Initializes modular components
//        o Manages extension lifecycle
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';
import { HeaderCommands } from './core/commands/header-commands';
import { ConfigCommands } from './core/commands/config-commands';
import { ManagementCommands } from './core/commands/management-commands';
import { AutoUpdater } from './core/auto-update/auto-updater';

/**
 * Extension activation function
 */
export function activate(context: vscode.ExtensionContext): void {
  // Initialize command modules
  const headerCommands = new HeaderCommands(context.extensionPath);
  const configCommands = new ConfigCommands();
  const managementCommands = new ManagementCommands();
  const autoUpdater = new AutoUpdater();

  // Register all commands
  headerCommands.register(context);
  configCommands.register(context);
  managementCommands.register(context);
  
  // Register auto-update functionality
  autoUpdater.register(context);
}

/**
 * Extension deactivation function
 */
export function deactivate(): void {
  // Cleanup if needed
}

