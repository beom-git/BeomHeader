# Beom Header

![Version](https://img.shields.io/badge/version-1.3.1-blue) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

Insert standardized file headers for various file types in Visual Studio Code, with customizable header templates, version and to-do entry templates.

---

## Features

- **Insert File Header**: Generates and inserts a full file header based on a user‑configurable template.
- **Insert Version Entry**: Appends a new version line to the File History section, auto‑incrementing major/patch numbers.
- **Insert To-Do Entry**: Appends a new to‑do line to the To‑Do List section, auto‑incrementing the index.
- **Fully Customizable** via the VS Code settings: comment tokens, header body, version entry template, to‑do template, shebang mappings, etc.

---

## Requirements

- Visual Studio Code **1.80.0** or higher
- Node.js and npm for building

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
3. Compile TypeScript:
   ```bash
   npm run compile
   ```
4. Launch the extension host: Press `F5` in VS Code.

---

## Usage

Use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Insert File Header** — `fileHeader.insert`
- **Insert Version Entry** — `fileHeader.insertVersion`
- **Insert TODO Entry** — `fileHeader.insertTodo`

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

All settings live under **Beom Header Settings** in `settings.json`:

| Setting                     | Type     | Default                                                                                                                                                                      | Description                                                                                   |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `commentTokenMap`           | object   | `{ "python": "#", ..., "systemverilog": "//", "tcl": "#", "upf": "#" }`                                                                                       | Map from language ID to comment token                                                         |
| `headerBodyTemplate`        | array    | Array of lines with placeholders: `${comment}`,`${startYear}`,`${endYear}`,`${company}`,`${projectName}`,`${fileName}`,`${author}`,`${today}`                              | Template for the main header body                                                             |
| `versionEntryTemplate`      | string   | `${comment}      * ${today} : (v${major}p${patch},  ${author}) Description\n`                                                                                              | Template for a version entry; use `${major}`, `${patch}`                                      |
| `todoEntryTemplate`         | string   | `${comment}      * ${today} : (ToDo#${index}, ${author}) Description\n`                                                                                                     | Template for a to‑do entry; use `${index}`                                                    |
| `shebangPerLanguage`        | object   | `{ "python": "/usr/bin/env python3", "bash": "/bin/bash" }`                                                                                                           | Map from language ID to shebang line                                                          |
| `projectName`               | string   | `MyProject`                                                                                                                                                                   | Project name for header                                                                       |
| `company`                   | string   | `YourCompany`                                                                                                                                                                 | Company name for copyright                                                                   |
| `copyrightStartYears`       | string   | `2023`                                                                                                                                                                        | Copyright start year                                                                         |

**Example** override in `settings.json`:
```json
{
  "beomHeader.projectName": "Arm CSS N2 Case Story",
  "beomHeader.company": "Supergate Inc.",
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

| Language ID     | Comment Token |
| --------------- | ------------- |
| python          | `#`           |
| shellscript     | `#`           |
| ruby            | `#`           |
| perl            | `#`           |
| lua             | `--`          |
| javascript      | `//`          |
| typescript      | `//`          |
| java            | `//`          |
| c               | `//`          |
| cpp             | `//`          |
| verilog         | `//`          |
| systemverilog   | `//`          |
| tcl             | `#`           |
| upf             | `#`           |

---

## Extension Structure

```plaintext
├── src/
│   ├── commentTokenMap.ts
│   ├── headerTemplate.ts
│   └── extension.ts
├── images/
│   └── icon.png
├── out/
│   └── (compiled .js files)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Contributing

Contributions are welcome! Please open issues or pull requests on GitHub.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
