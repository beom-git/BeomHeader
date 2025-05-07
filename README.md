# Beom Header

![Version](https://img.shields.io/badge/version-1.1.3-blue) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

Insert standardized file headers (shebang, copyright, history…) for various file types in Visual Studio Code.

---

## Features

* **Insert File Header**: Generates and inserts a full file header with:

  * Optional shebang (`#!...`) based on file language
  * Copyright line with configurable start year and automatic end year
  * Project name, file name, author, creation date, and description section
  * File history entry and initial To-Do placeholder
* **Insert Version Entry**: Appends a new version line to the File History section.
* **Insert TODO Entry**: Appends a new To-Do line to the To-Do section.

---

## Requirements

* Visual Studio Code **1.60.0** or higher
* Node.js and npm installed for building the extension

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/beom-git/BeomHeader.git
   cd BeomHeader
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Compile TypeScript sources:

   ```bash
   npm run compile
   ```
4. Press `F5` in VS Code to launch the Extension Development Host.

> Alternatively, install directly from the VS Code Marketplace (coming soon).

---

## Usage

### Commands

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:

* `Insert File Header` — Inserts the complete header at the top of the active file.
* `Insert Version Entry` — Inserts a new version entry under **File History**.
* `Insert TODO Entry` — Inserts a new entry under **To-Do List**.

### Keybindings

By default, the following keybinding is provided:

```json
{
  "key": "ctrl+alt+h",
  "command": "fileHeader.insert",
  "when": "editorTextFocus"
}
```

You can customize or add additional bindings in your VS Code `keybindings.json`.

---

## Configuration

The extension contributes the following settings under **`Beom Header Settings`**:

| Setting                          | Type   | Default                                                     | Description                          |
| -------------------------------- | ------ | ----------------------------------------------------------- | ------------------------------------ |
| `beomHeader.shebangPerLanguage`  | object | `{ "python": "/usr/bin/env python3", "bash": "/bin/bash" }` | Map file language ID to shebang line |
| `beomHeader.projectName`         | string | `MyProject`                                                 | Project name to display              |
| `beomHeader.copyrightStartYears` | string | `2023`                                                      | Start year for copyright range       |
| `beomHeader.company`             | string | `YourCompany`                                               | Company name for copyright           |

Example in **`settings.json`**:

```json
{
  "beomHeader.projectName": "MyProject",
  "beomHeader.company": "YourCompany",
  "beomHeader.shebangPerLanguage": {
    "python": "/usr/bin/env python3",
    "bash": "/usr/bin/env bash"
  },
  "beomHeader.copyrightStartYears": "2025"
}
```

---

## Supported Languages

Below is the list of languages supported by the `commentTokenMap` along with their comment tokens:

| Language ID   | Comment Token |
| ------------- | ------------- |
| python        | `#`           |
| shellscript   | `#`           |
| ruby          | `#`           |
| perl          | `#`           |
| lua           | `--`          |
| javascript    | `//`          |
| typescript    | `//`          |
| java          | `//`          |
| c             | `//`          |
| cpp           | `//`          |
| csharp        | `//`          |
| go            | `//`          |
| rust          | `//`          |
| php           | `//`          |
| swift         | `//`          |
| kotlin        | `//`          |
| verilog       | `//`          |
| systemverilog | `//`          |
| tcl           | `#`           |
| upf           | `#`           |

## Extension Structure

```
├── src/
│   ├── commentTokenMap.ts       # Language comment token definitions
│   ├── headerTemplate.ts        # Header generation logic
│   └── extension.ts             # Activation and command registration
├── out/                          # Compiled JavaScript files
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or pull request on GitHub.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.
