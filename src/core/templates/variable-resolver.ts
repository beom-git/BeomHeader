//----------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : variable-resolver.ts
// Author        : seongbeom
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 09:00:00 (by seongbeom)
// Editor        : Visual Studio Code, space size (2)
// Description   : 
//
//     This file manages template variable resolution and interpolation.
//        o Resolves all template variables from configuration and context
//        o Provides template interpolation functionality
//
//----------------------------------------------------------------------

import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { TemplateVariables, TemplateContext } from '../../types/template.types';
import { AuthorInfo, EditorConfig, FileInfo } from '../../types/common.types';
import { BeomHeaderConfig } from '../../types/config.types';
import { getTodayFormatted, getCurrentTimestamp, getCurrentYear } from '../../utils/date-utils';
import { interpolateTemplate, generateSeparator } from '../../utils/string-utils';

/**
 * Variable resolver for template interpolation
 */
export class VariableResolver {
  /**
   * Resolve all template variables from document and configuration
   */
  public resolveVariables(
    document: vscode.TextDocument,
    config: vscode.WorkspaceConfiguration,
    extensionPath: string
  ): TemplateVariables {
    const fileInfo = this.getFileInfo(document);
    const authorInfo = this.getAuthorInfo(config);
    const editorConfig = this.getEditorConfig(document);
    const licenseInfo = this.getLicenseInfo(config);
    
    const startYear = config.get<string>('copyrightStartYears', '');
    const endYear = getCurrentYear();
    const today = getTodayFormatted();
    const lastModifiedDate = getCurrentTimestamp();
    const lastModifiedUser = os.userInfo().username;
    
    const separator = this.generateSeparator(config);
    
    const variables: TemplateVariables = {
      // Basic tokens
      comment: this.getCommentToken(document.languageId, config),
      separator: separator.substring(this.getCommentToken(document.languageId, config).length),
      
      // Project information
      projectName: config.get<string>('projectName', ''),
      projectDescription: this.getProjectDescription(config),
      company: config.get<string>('company', ''),
      
      // File information
      fileName: fileInfo.name,
      fullPath: fileInfo.fullPath,
      relativePath: fileInfo.relativePath,
      baseFileName: fileInfo.baseName,
      
      // Author information
      author: authorInfo.name,
      authorName: this.formatAuthorName(authorInfo),
      authorEmail: authorInfo.email,
      authorFullName: authorInfo.fullName,
      authorTitle: authorInfo.title,
      teamName: config.get<string>('teamName', ''),
      
      // Date and time
      today,
      lastModifiedDate,
      lastModifiedUser,
      currentDate: today,
      currentYear: new Date().getFullYear().toString(),
      startYear,
      endYear,
      
      // Required core fields
      creationDate: today,
      description: this.getProjectDescription(config),
      copyright: this.getCopyrightNotice(config, { startYear, endYear, company: config.get<string>('company', ''), author: authorInfo.name }),
      fileHistory: '',
      todoList: '',
      authorWithEmail: authorInfo.email ? `${authorInfo.name} (${authorInfo.email})` : authorInfo.name,
      
      // Editor information
      editorInfo: this.formatEditorInfo(editorConfig),
      
      // Legal information
      copyrightNotice: this.getCopyrightNotice(config, { startYear, endYear, company: config.get<string>('company', ''), author: authorInfo.name }),
      licenseText: licenseInfo.text,
      licenseType: licenseInfo.type,
      licenseUrl: licenseInfo.url,
    };
    
    return variables;
  }

  /**
   * Interpolate template with variables
   */
  public interpolateTemplate(template: string, variables: TemplateVariables): string {
    return interpolateTemplate(template, variables);
  }

  /**
   * Get file information from document
   */
  private getFileInfo(document: vscode.TextDocument): FileInfo {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const relativePath = workspaceFolder 
      ? path.relative(workspaceFolder.uri.fsPath, document.fileName)
      : path.basename(document.fileName);
    
    return {
      name: path.basename(document.fileName),
      fullPath: document.fileName,
      relativePath,
      baseName: path.basename(document.fileName, path.extname(document.fileName)),
      languageId: document.languageId
    };
  }

  /**
   * Get author information from configuration
   */
  private getAuthorInfo(config: vscode.WorkspaceConfiguration): AuthorInfo {
    const authorFullName = config.get<string>('authorFullName', '');
    const authorEmail = config.get<string>('authorEmail', '');
    const authorTitle = config.get<string>('authorTitle', '');
    const systemUsername = os.userInfo().username;
    
    return {
      name: authorFullName || systemUsername,
      email: authorEmail,
      fullName: authorFullName,
      title: authorTitle
    };
  }

  /**
   * Get editor configuration
   */
  private getEditorConfig(document: vscode.TextDocument): EditorConfig {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor || editor.document !== document) {
      return {
        tabSize: 4,
        insertSpaces: true,
        editorName: vscode.env.appName
      };
    }
    
    return {
      tabSize: (editor.options.tabSize as number) || 4,
      insertSpaces: editor.options.insertSpaces as boolean,
      editorName: vscode.env.appName
    };
  }

  /**
   * Get license information
   */
  private getLicenseInfo(config: vscode.WorkspaceConfiguration): { text: string; type: string; url: string } {
    const licenseType = config.get<string>('licenseType', 'All Rights Reserved');
    const customLicenseText = config.get<string>('customLicenseText', '');
    const licenseUrl = config.get<string>('licenseUrl', '');
    
    const licenseTexts: Record<string, string> = {
      'All Rights Reserved': 'All Rights Reserved',
      'MIT': 'Licensed under the MIT License',
      'Apache-2.0': 'Licensed under the Apache License, Version 2.0',
      'GPL-3.0': 'Licensed under the GNU General Public License v3.0',
      'GPL-2.0': 'Licensed under the GNU General Public License v2.0',
      'LGPL-3.0': 'Licensed under the GNU Lesser General Public License v3.0',
      'LGPL-2.1': 'Licensed under the GNU Lesser General Public License v2.1',
      'BSD-3-Clause': 'Licensed under the BSD 3-Clause License',
      'BSD-2-Clause': 'Licensed under the BSD 2-Clause License',
      'ISC': 'Licensed under the ISC License',
      'MPL-2.0': 'Licensed under the Mozilla Public License 2.0',
      'Unlicense': 'Released into the public domain'
    };
    
    const text = licenseType === 'Custom' 
      ? (customLicenseText || 'All Rights Reserved')
      : (licenseTexts[licenseType] || 'All Rights Reserved');
    
    return { text, type: licenseType, url: licenseUrl };
  }

  /**
   * Get comment token for language
   */
  private getCommentToken(languageId: string, config: vscode.WorkspaceConfiguration): string {
    const commentMap = config.get<Record<string, string>>('commentTokenMap', {});
    return commentMap[languageId] || '#';
  }

  /**
   * Generate separator line
   */
  private generateSeparator(config: vscode.WorkspaceConfiguration): string {
    const separatorLength = config.get<number>('separatorLength', 70);
    const separatorChar = config.get<string>('separatorChar', '-');
    
    return generateSeparator(separatorChar, separatorLength);
  }

  /**
   * Format author name with email if available
   */
  private formatAuthorName(authorInfo: AuthorInfo): string {
    return authorInfo.email 
      ? `${authorInfo.name} (${authorInfo.email})`
      : authorInfo.name;
  }

  /**
   * Format editor information
   */
  private formatEditorInfo(editorConfig: EditorConfig): string {
    const indentType = editorConfig.insertSpaces ? 'space' : 'tab';
    return `${editorConfig.editorName}, ${indentType} size (${editorConfig.tabSize})`;
  }

  /**
   * Get project description with variable interpolation
   */
  private getProjectDescription(config: vscode.WorkspaceConfiguration): string {
    const template = config.get<string>('projectDescription', 'This module provides core functionality for the ${projectName} application');
    const projectName = config.get<string>('projectName', '');
    return interpolateTemplate(template, { projectName });
  }

  /**
   * Get copyright notice with variable interpolation
   */
  private getCopyrightNotice(config: vscode.WorkspaceConfiguration, vars: Record<string, string>): string {
    const template = config.get<string>('copyrightNotice', '(C) Copyright ${startYear}-${endYear} ${company}');
    return interpolateTemplate(template, vars);
  }
}
