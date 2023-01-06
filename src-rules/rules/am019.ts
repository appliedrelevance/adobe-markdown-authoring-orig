// @ts-check
"use strict";

import { filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
  "names": ["AM019", "link-syntax"],
  "description": "Malformed link",
  "tags": ["link"],
  "function": function AM019(params: FilterParams, onError: (context: ErrorContext) => void) {
    const codeBlockRe = new RegExp("```");
    var inCodeBlock = false;
    forEachLine(function forLine(line, lineIndex) {
      const lineNumber = lineIndex + 1
      const spaceinlink = line.match(/\[[^!].*?\]\s+\(/)
      const codeBlockMatch = codeBlockRe.exec(line)
      const spaceinurl = line.match(/\[[^!].*?\]\(\s+/)
      const pareninurl = line.match(/\[[^!].*?\]\(\(/)
      const bracesnotparens = line.match(/\]\{[^#]/)
      if (codeBlockMatch) {
        inCodeBlock = !inCodeBlock;
      }

      if (!inCodeBlock && spaceinurl != null) {
        addError(onError, lineNumber, 'Space in link target URL', line, null)
      }

      if (!inCodeBlock && pareninurl != null) {
        addError(onError, lineNumber, 'Paren in link target URL', line, null)
      }

      // if (!inCodeBlock && bracesnotparens != null) {
      //   addError(onError, lineNumber, 'Using braces {} instead of parens ()', line, null)
      // }
    });
  }
}
