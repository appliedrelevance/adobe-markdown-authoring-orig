// @ts-check

"use strict";

import { filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
  "names": ["AM010", "id-tag-has-hash"],
  "description": "ID Tags ({#id-tag-name} cannot contain additional hash marks ({#id-has-#hash}",
  "tags": ["headings", "headers"],
  "function": function AM010(params: FilterParams, onError: (context: ErrorContext) => void) {
    let prevLevel = 0;
    filterTokens(params, "heading_open", function forToken(token) {
      var heading_title = token.line.replace(/^[#]+ /g, "");
      if (heading_title.match(/.*{#.*[#].*}/)) {
        addErrorContext(onError, token.lineNumber, token.line);
      }
    });
  }
};
