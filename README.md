# Beom Header

![Version](https://img.shields.io/badge/version-3.0.2-blue) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

Insert standardized file headers for various file types in Visual Studio Code, with comprehensive configuration options, auto-update features, and modular architecture.

## What's New in v3.0

- **Complete Architecture Refactoring**: Modular design with separated concerns for better maintainability
- **Organized Code Structure**: New directory structure with `core/`, `utils/`, `types/`, and `assets/` modules
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions throughout
- **Enhanced Performance**: Optimized template processing and variable resolution
- **Command Separation**: Organized commands into logical groups (header, config, management)
- **Improved Template System**: Better template management with secure asset handling
- **Auto-Update System**: Redesigned with strategy pattern for extensible update logic
- **60+ Language Support**: Extended comment token mappings for more programming languages
- **Consistent Function Naming**: Unified naming conventions across all modules
- **Better Error Handling**: Improved validation and error reporting throughout

---**Example** configuration in `settings.json`:
```json
{
  "beomHeader.projectName": "My Awesome Project",
  "beomHeader.company": "Tech Corp Inc.",
  "beomHeader.authorFullName": "John Doe",
  "beomHeader.authorEmail": "john.doe@techcorp.com",
  "beomHeader.teamName": "Development Team",
  "beomHeader.licenseType": "MIT",
  "beomHeader.headerStyle": "detailed",
  "beomHeader.projectDescription": "This module provides advanced functionality for the ${projectName} system",
  "beomHeader.autoUpdateLastModified": true,
  "beomHeader.autoUpdateEditor": true,
  "beomHeader.separatorChar": "=",
  "beomHeader.separatorLength": 80,
  "beomHeader.copyrightNotice": "(C) Copyright ${startYear}-${endYear} ${company}",
  "beomHeader.versionFormat": "v{major:02d}p{patch:02d}",
  "beomHeader.showRelativePath": true,
  "beomHeader.includeLicenseHeader": true
}
```

---

## Features

- **Smart Header Insertion**: Generates comprehensive file headers with intelligent template selection
- **Version Management**: Auto-incrementing version entries with configurable format patterns
- **To-Do Integration**: Organized to-do entries with automatic indexing and date tracking
- **Auto-Update System**: Strategy-based auto-updates for timestamps and editor information
- **Modular Architecture**: Clean separation of concerns with organized code structure
- **Multiple Header Styles**: Choose from standard, minimal, or detailed header templates
- **Extensive Language Support**: 60+ programming languages with smart comment detection
- **Comprehensive Configuration**: 25+ configuration options for complete customization
- **Command-Based Management**: 20+ easy-to-use commands for all configuration aspects
- **Type-Safe Development**: Full TypeScript implementation with comprehensive type definitions
- **Project Integration**: Advanced project descriptions, license management, and team information
- **Secure Template System**: JSON-based templates with validation and error handling
- **Performance Optimized**: Efficient template processing and variable resolution
- **Flexible Styling**: Customizable separators, lengths, and formatting options

---

## Requirements

- Visual Studio Code **1.80.0** or higher
- Node.js **16.0** or higher and npm for building
- TypeScript **4.5** or higher for development

---

## Development

### Architecture Overview

The extension follows a modular architecture with clear separation of concerns:

- **Core Modules**: Business logic organized by domain (commands, templates, auto-update, language)
- **Type System**: Comprehensive TypeScript interfaces ensuring type safety
- **Utility Layer**: Reusable functions for common operations (date, string, validation)
- **Asset Management**: Secure template storage and loading system

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/beom-git/BeomHeader.git
   cd BeomHeader
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile TypeScript:
   ```bash
   npm run compile
   ```
4. Launch extension host: Press `F5` in VS Code to start debugging

---

## Usage

### Basic Commands

Use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Insert File Header** — `fileHeader.insert`
- **Insert Version Entry** — `fileHeader.insertVersion`
- **Insert TODO Entry** — `fileHeader.insertTodo`

### Configuration Commands

#### Header Management
- **Insert File Header** — `fileHeader.insert`
- **Insert Version Entry** — `fileHeader.insertVersion`
- **Insert TODO Entry** — `fileHeader.insertTodo`

#### Configuration Management
- **Configure Author Information** — `fileHeader.configureAuthorInfo`
- **Configure License** — `fileHeader.configureLicense`
- **Configure Copyright Notice** — `fileHeader.configureCopyrightNotice`
- **Configure License URL** — `fileHeader.configureLicenseUrl`
- **Configure Version Format** — `fileHeader.configureVersionFormat`
- **Configure Header Style** — `fileHeader.configureHeaderStyle`
- **Configure Project Description** — `fileHeader.configureProjectDescription`
- **Configure File Path Display** — `fileHeader.configureFilePath`
- **Configure Path Separator** — `fileHeader.configurePathSeparator`

#### Language & Style Management
- **Add Language Comment Token Mapping** — `fileHeader.addLanguageMapping`
- **Remove Language Comment Token Mapping** — `fileHeader.removeLanguageMapping`
- **List All Language Comment Token Mappings** — `fileHeader.listLanguageMappings`
- **Select Header Template Style** — `fileHeader.selectHeaderStyle`

#### Toggle Settings
- **Toggle Auto Update Last Modified** — `fileHeader.toggleAutoUpdateLastModified`
- **Toggle Auto Update Editor Info** — `fileHeader.toggleAutoUpdateEditor`
- **Toggle License Header** — `fileHeader.toggleLicenseHeader`
- **Toggle Auto Increment Version** — `fileHeader.toggleAutoIncrementVersion`

Default keybinding:
```json
{
  "key": "ctrl+alt+h",
  "command": "fileHeader.insert",
  "when": "editorTextFocus"
}
```

---

## Configuration

All settings live under **Beom Header Settings** in `settings.json`. The extension now uses secure template management with JSON files.

### Core Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `projectName`               | string   | `MyProject`                                | Project name for header                         |
| `company`                   | string   | `YourCompany`                              | Company name for copyright                       |
| `copyrightStartYears`       | string   | `2023`                                     | Copyright start year                             |

### Author & Team Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `authorFullName`            | string   | `""`                                       | Full author name (uses system username if empty) |
| `authorEmail`               | string   | `""`                                       | Author email address                             |
| `authorTitle`               | string   | `""`                                       | Author title or role                             |
| `teamName`                  | string   | `""`                                       | Team or department name                          |

### License Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `licenseType`               | string   | `All Rights Reserved`                      | License type (MIT, Apache-2.0, GPL-3.0, etc.)  |
| `customLicenseText`         | string   | `""`                                       | Custom license text                              |
| `licenseUrl`                | string   | `""`                                       | URL to license text                              |
| `copyrightNotice`           | string   | `(C) Copyright ${startYear}-${endYear} ${company}` | Copyright notice template           |
| `includeLicenseHeader`      | boolean  | `true`                                     | Include license in header                        |

### File Path & Display Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `showFullPath`              | boolean  | `false`                                    | Show full absolute path                          |
| `showRelativePath`          | boolean  | `false`                                    | Show relative path from workspace               |
| `pathSeparator`             | string   | `/`                                        | Path separator character                         |

### Header Style Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `headerStyle`               | string   | `standard`                                 | Header template style (standard/minimal/detailed) |
| `separatorChar`             | string   | `-`                                        | Separator character for header lines             |
| `separatorLength`           | number   | `70`                                       | Length of separator lines                        |

### Version Format Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `versionFormat`             | string   | `v{major:02d}p{patch:02d}`                | Version number format                            |
| `customVersionFormat`       | string   | `v{major:02d}p{patch:02d}`                | Custom version format                            |
| `includeMinorVersion`       | boolean  | `false`                                    | Include minor version numbers                    |
| `autoIncrementVersion`      | boolean  | `true`                                     | Auto-increment version numbers                   |

### Auto-Update Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `autoUpdateLastModified`    | boolean  | `true`                                     | Auto-update Last Modified on save               |
| `autoUpdateEditor`          | boolean  | `true`                                     | Auto-update Editor info on save                 |

### Project Description Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `projectDescription`        | string   | `This module provides core functionality for the ${projectName} application` | Project description template |

### Language & Comment Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `commentTokenMap`           | object   | `{ "python": "#", "javascript": "//", ... }` | Map from language ID to comment token         |
| `shebangPerLanguage`        | object   | `{ "python": "/usr/bin/env python3", ... }`  | Map from language ID to shebang line          |

**Example** override in `settings.json`:
```json
{
  "beomHeader.projectName": "Demo Project",
  "beomHeader.company": "Seongbeom.",
  "beomHeader.headerBodyTemplate": [
    "${comment}====== Custom Header ======",
    "${comment} Project : ${projectName}",
    "${comment}",
    "${comment} Description :",
    "${comment}------",
    "${comment} File History :",
    "${comment}      * ${today} : (v01p00, ${author}) Init"
  ],
  "beomHeader.versionEntryTemplate": "${comment} * ${today} : (v${major}p${patch}, ${author}) Updated\n",
  "beomHeader.todoEntryTemplate": "${comment} * ${today} : (ToDo#${index}, ${author}) Action\n"
}
```

---

## Supported Languages

The extension supports 60+ programming languages with appropriate comment tokens:

| Language ID     | Comment Token | Language ID     | Comment Token |
| --------------- | ------------- | --------------- | ------------- |
| python          | `#`           | javascript      | `//`          |
| shellscript     | `#`           | typescript      | `//`          |
| ruby            | `#`           | java            | `//`          |
| perl            | `#`           | c               | `//`          |
| lua             | `--`          | cpp             | `//`          |
| verilog         | `//`          | csharp          | `//`          |
| systemverilog   | `//`          | rust            | `//`          |
| tcl             | `#`           | go              | `//`          |
| upf             | `#`           | swift           | `//`          |
| yaml            | `#`           | kotlin          | `//`          |
| makefile        | `#`           | scala           | `//`          |
| dockerfile      | `#`           | php             | `//`          |
| bash            | `#`           | dart            | `//`          |
| zsh             | `#`           | groovy          | `//`          |
| powershell      | `#`           | haskell         | `--`          |

*You can add custom language mappings using the "Add Language Comment Token Mapping" command.*

---

## Extension Structure

```plaintext
├── src/
│   ├── core/                          # Core business logic modules
│   │   ├── auto-update/               # Auto-update system
│   │   │   └── auto-updater.ts        # Strategy-based update logic
│   │   ├── commands/                  # Command implementations
│   │   │   ├── header-commands.ts     # Header insertion commands
│   │   │   ├── config-commands.ts     # Configuration commands
│   │   │   └── management-commands.ts # Management & toggle commands
│   │   ├── language/                  # Language support
│   │   │   └── comment-token-map.ts   # Comment token mappings
│   │   └── templates/                 # Template processing
│   │       ├── template-manager.ts    # Template loading & management
│   │       └── variable-resolver.ts   # Variable resolution logic
│   ├── types/                         # TypeScript type definitions
│   │   ├── common.types.ts            # Common type definitions
│   │   ├── config.types.ts            # Configuration interfaces
│   │   └── template.types.ts          # Template system types
│   ├── utils/                         # Utility functions
│   │   ├── date-utils.ts              # Date/time utilities
│   │   ├── string-utils.ts            # String manipulation utilities
│   │   └── validation-utils.ts        # Input validation utilities
│   ├── assets/                        # Static resources
│   │   └── templates/                 # Secure JSON template files
│   │       ├── headerBodyTemplate.json
│   │       ├── versionEntryTemplate.json
│   │       └── todoEntryTemplate.json
│   ├── extension.ts                   # Main extension entry point
│   └── test/                          # Test files
├── images/
│   └── icon.png                       # Extension icon
├── out/                               # Compiled JavaScript files
├── package.json                       # Extension manifest
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file
```

## Template System

The extension uses a sophisticated modular template system with the following components:

### Template Architecture

- **Template Manager**: Centralized template loading and management from secure JSON files
- **Variable Resolver**: Advanced variable resolution with type-safe processing
- **Auto-Updater**: Strategy-based system for automatic header updates with extensible patterns
- **Comment Token Map**: Comprehensive language support with intelligent comment detection

### Available Header Styles

- **Standard**: Comprehensive header with full project information and metadata
- **Minimal**: Compact header with essential information only for quick development
- **Detailed**: Extended header with additional fields, sections, and documentation

### Auto-Update Features

- **Last Updated**: Automatically updates timestamp and user information when files are saved
- **Editor Info**: Intelligently tracks current editor settings (e.g., "Visual Studio Code, space size (2)")
- **Strategy Pattern**: Extensible update strategies for different types of automatic updates
- **Configuration Control**: Fine-grained control over which auto-update features are active

### Template Security

- **Secure Storage**: Templates stored in protected `src/assets/templates/` directory
- **Validation**: Comprehensive input validation and error handling
- **Type Safety**: Full TypeScript type checking for all template operations
- **JSON Format**: Human-readable JSON templates with schema validation

### Command System

The extension provides 20+ commands organized into logical groups:
- **Header Commands**: Core header insertion functionality
- **Config Commands**: Configuration and settings management  
- **Management Commands**: Language mappings and toggle settings

All commands are accessible through the VS Code Command Palette for easy access.

---

## Contributing

Contributions are welcome! Please open issues or pull requests on GitHub.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
