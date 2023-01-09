// @ts-check

"use strict";

import { filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
  "names": ["AM018", "blanks-around-blockquotes"],
  "description": "Block quotes should be surrounded by blank lines",
  "tags": ["blockquote", "blank_lines"],
  "function": function AM018(params: FilterParams, onError: (context: ErrorContext) => void) {
    var checklines = []
    filterTokens(params, "blockquote_open", function forToken(token) {
      var index = 0
      checklines.push(token.map[0])
      checklines.push(token.map[1])
    }
    );
    forEachLine(function forLine(line, i) {
      var err = '  '
      if (checklines.includes(i + 1)) {
        if (line.replace(/\s/g, '').length && !line.match(/^[\s]*\>/)) {
          addErrorContext(onError, i + 1, line);
        }
      }
    });

  }
};