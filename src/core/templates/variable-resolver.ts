//--------------------------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name  : VS Code Extension
// File Name     : variable-resolver.ts
// Author        : seongbeom (lub8881@kakao.com)
// First Created : 2025/09/08
// Last Updated  : 2025-09-08 07:04:52 (by root)
// Editor        : Visual Studio Code, tab size (4)
// Description   : 
//
//     This module provides core functionality for the VS Code Extension application
//        o 
//
//--------------------------------------------------------------------
// File History :
//      * 2025/09/08 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/09/08 : (ToDo#00, seongbeom) None
//--------------------------------------------------------------------

import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { getCommentToken } from '../language/comment-token-map';
import { TemplateVariables } from '../../types/template.types';
import { AuthorInfo, EditorConfig, FileInfo } from '../../types/common.types';
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
    
    // Get startYear - VS Code should use package.json default automatically
    const startYear = config.get<string>('copyrightStartYears', '<Error>');
    const endYear = getCurrentYear();
    const today = getTodayFormatted();
    const lastModifiedDate = getCurrentTimestamp();
    const lastModifiedUser = os.userInfo().username;
    
    const separator = this.generateSeparator(config);
    
    const variables: TemplateVariables = {
      // Basic tokens
      comment: getCommentToken(document.languageId).single || '//',
      separator: separator.substring((getCommentToken(document.languageId).single || '//').length),
      
      // Project information
      projectName: config.get<string>('projectName', '<Error>'),
      projectDescription: this.getProjectDescription(config),
      companyName: config.get<string>('companyName', '<Error>'),
      
      // File information
      fileName: fileInfo.name,
      fullPath: fileInfo.fullPath,
      relativePath: fileInfo.relativePath,
      baseFileName: fileInfo.baseName,
      
      // Author information
      author: authorInfo.name,
      authorName: authorInfo.name,
      authorEmail: authorInfo.email,
      authorFullName: authorInfo.fullName,
      authorTitle: authorInfo.title,
      authorWithTitle: this.formatAuthorWithTitle(authorInfo),
      teamName: config.get<string>('teamName', '<Error>'),
      
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
      copyright: this.getCopyrightNotice(config, { startYear, endYear, companyName: config.get<string>('companyName', '<Error>'), author: authorInfo.name }),
      fileHistory: '',
      todoList: '',
      authorWithEmail: this.formatAuthorWithEmail(authorInfo),
      
      // Editor information
      editorInfo: this.formatEditorInfo(editorConfig),
      
      // Legal information
      copyrightNotice: this.getCopyrightNotice(config, { startYear, endYear, companyName: config.get<string>('companyName', '<Error>'), author: authorInfo.name }),
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
    const authorFullName = config.get<string>('authorFullName', '<Error>');
    const authorEmail = config.get<string>('authorEmail', '<Error>');
    const authorTitle = config.get<string>('authorTitle', '<Error>');
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
    const licenseType = config.get<string>('licenseType', '<Error>');
    const customLicenseText = config.get<string>('customLicenseText', '<Error>');
    const licenseUrl = config.get<string>('licenseUrl', '<Error>');
    
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
      ? (customLicenseText || '<Error>')
      : (licenseTexts[licenseType] || '<Error>');
    
    return { text, type: licenseType, url: licenseUrl };
  }

  /**
   * Generate separator line
   */
  private generateSeparator(config: vscode.WorkspaceConfiguration): string {
    const separatorLength = config.get<number>('separatorLength', 70);
    const separatorChar = config.get<string>('separatorChar', '<Error>');
    
    return generateSeparator(separatorChar, separatorLength);
  }

  /**
   * Format author name with email if available (smart formatting to avoid duplicates)
   */
  private formatAuthorWithEmail(authorInfo: AuthorInfo): string {
    if (!authorInfo.email) {
      return authorInfo.name;
    }
    
    // Check if email is already included in the name
    if (authorInfo.name.includes(authorInfo.email)) {
      return authorInfo.name;
    }
    
    return `${authorInfo.name} (${authorInfo.email})`;
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
    const template = config.get<string>('projectDescription', '<Error>');
    const projectName = config.get<string>('projectName', '<Error>');
    return interpolateTemplate(template, { projectName });
  }

  /**
   * Get copyright notice with variable interpolation
   */
  private getCopyrightNotice(config: vscode.WorkspaceConfiguration, vars: Record<string, string>): string {
    const template = config.get<string>('copyrightNotice', '<Error>');
    return interpolateTemplate(template, vars);
  }

  /**
   * Format author with title using hyphen separation
   */
  private formatAuthorWithTitle(authorInfo: AuthorInfo): string {
    if (authorInfo.title && authorInfo.title.trim()) {
      if (authorInfo.email && authorInfo.email.trim()) {
        return `${authorInfo.name} - ${authorInfo.title} <${authorInfo.email}>`;
      } else {
        return `${authorInfo.name} - ${authorInfo.title}`;
      }
    } else {
      if (authorInfo.email && authorInfo.email.trim()) {
        return `${authorInfo.name} <${authorInfo.email}>`;
      } else {
        return authorInfo.name;
      }
    }
  }
}
