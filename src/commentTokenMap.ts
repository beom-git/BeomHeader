//-----------------------------------------------------
// (C) Copyright 2023-2025 Seongbeom
//
// All Rights Reserved
//
// Project Name : VS Code Extension
// File Name    : commentTokenMap.ts
// Author       : seongbeom
// Creation Date: 2025/05/07
// Description  : 
//
// File History :
//      * 2025/05/07 : (v01p00,  seongbeom) First Release by 'seongbeom'
// To-Do List   :
//      * 2025/05/07 : (ToDo#00, seongbeom) None
//-----------------------------------------------------

export const commentTokenMap: { [lang: string]: string } = {
  python: '#',
  shellscript: '#',
  ruby: '#',
  perl: '#',
  lua: '--',
  javascript: '//',
  typescript: '//',
  java: '//',
  cpp: '//',
  csharp: '//',
  go: '//',
  rust: '//',
  php: '//',
  swift: '//',
  kotlin: '//',
  verilog: '//',
  systemverilog: '//',
  tcl: '#',
  upf: '#'
};
