# Beom Header

![Version](https://img.shields.io/badge/version-3.2.5-blue) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

Insert standardized file headers for various file types in Visual Studio Code, with comprehensive configuration options, auto-update features, and modular architecture.

---

## Features

- **Smart Header Insertion**: Comprehensive file headers with template selection
- **Content Preservation**: Preserves existing Description, File History, and To-Do List during updates
- **Version Management**: Auto-incrementing version entries with configurable formats
- **To-Do Integration**: Organized to-do entries with automatic indexing
- **Auto-Update System**: Automatic timestamp and editor information updates
- **Multiple Header Styles**: Standard, minimal, and detailed templates
- **Extensive Language Support**: 50+ programming languages
- **Command-Based Management**: 28+ commands for configuration
- **Type-Safe Development**: Full TypeScript implementation
- **Flexible Configuration**: Comprehensive customization options

---

## Requirements

- Visual Studio Code **1.80.0** or higher
- Node.js **16.0** or higher and npm for building
- TypeScript **4.5** or higher for development

---

## Usage

### Basic Commands

Use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

#### Header Management
- **Insert File Header** — `fileHeader.insert`
- **Insert Version Entry** — `fileHeader.insertVersion`
- **Insert TODO Entry** — `fileHeader.insertTodo`
- **Update Current Header** — `fileHeader.updateCurrentHeader` ⭐
- **Update All Headers in Workspace** — `fileHeader.updateAllHeaders` ⭐

#### Configuration
- **Configure Author Information** — `fileHeader.configureAuthorInfo`
- **Configure License** — `fileHeader.configureLicense`
- **Configure Header Style** — `fileHeader.configureHeaderStyle`
- **Configure Project Description** — `fileHeader.configureProjectDescription`

#### Language Management
- **Add/Remove Language Mappings** — `fileHeader.addLanguageMapping`
- **Toggle Auto Updates** — `fileHeader.toggleAutoUpdateLastModified`

### Keybindings
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

### Core Settings

| Setting                     | Type     | Default                                    | Description                                     |
| --------------------------- | -------- | ------------------------------------------ | ----------------------------------------------- |
| `projectName`               | string   | `MyProject`                                | Project name for header                         |
| `companyName`               | string   | `YourCompany`                              | Company name for copyright                      |
| `authorFullName`            | string   | `""`                                       | Full author name                                |
| `authorEmail`               | string   | `""`                                       | Author email address                            |
| `headerStyle`               | string   | `standard`                                 | Header template style (standard/minimal/detailed) |
| `autoUpdateLastModified`    | boolean  | `true`                                     | Auto-update Last Modified on save              |

### Advanced Settings

Additional settings available for license management, version formatting, language mappings, and display options. See VS Code settings for full configuration options.

**Example configuration:**
```json
{
  "beomHeader.projectName": "My Project",
  "beomHeader.companyName": "My Company",
  "beomHeader.authorFullName": "Seongbeom",
  "beomHeader.authorEmail": "lub8881@kakao.com",
  "beomHeader.headerStyle": "standard"
}
```

---

## Supported Languages

The extension supports **50+ programming languages** with automatic comment detection:

**Popular Languages:** TypeScript, JavaScript, Python, Java, C/C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, and more.

**Comment Tokens:** Automatically detects appropriate comment tokens (`//`, `#`, `--`, `/*`) for each language.

**Customization:** Use configuration commands to add custom languages or modify existing mappings.

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
│   └── test/                          # Comprehensive test suite
│       ├── extension.test.ts          # Basic extension functionality tests
│       ├── header-commands.test.ts    # Header insertion & content preservation tests
│       ├── variable-resolver.test.ts  # Variable resolution & error fallback tests
│       ├── template-manager.test.ts   # Template management & consistency tests
│       ├── string-utils.test.ts       # String utility function tests
│       └── runTest.js                 # Test runner configuration
├── images/
│   └── icon.png                       # Extension icon
├── out/                               # Compiled JavaScript files
├── package.json                       # Extension manifest
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file
```

## Template System

### Header Styles
- **Standard**: Complete header with full project information
- **Minimal**: Compact header for quick development  
- **Detailed**: Extended header with additional documentation

### Key Features
- **Auto-Updates**: Automatic timestamp and editor tracking
- **Content Preservation**: Maintains user content during updates
- **28+ Commands**: Full configuration through VS Code Command Palette
- **Type Safety**: Full TypeScript implementation with comprehensive testing

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

### Testing

Comprehensive test coverage with automated test suites:

```bash
npm test                    # Run all tests
npm run watch-tests        # Watch mode for development
```

**Test Coverage:**
- ✅ Header insertion and content preservation
- ✅ Variable resolution and error handling  
- ✅ Template management and consistency
- ✅ Multi-language support and configuration

---

## Contributing

Contributions are welcome! Please open issues or pull requests on GitHub.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
