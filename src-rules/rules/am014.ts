"use strict";

import { ErrorContext, FilterParams, forEachLine } from "../shared";

module.exports = {
  "names": ["AM014", "code-block-language-has-curly-braces"],
  "description": "Language identifier for code-blocks should not contain braces",
  "tags": ["code", "indent_level"],
  "function": function AM014(params: FilterParams, onError: (context: ErrorContext) => void) {
    const lines = params.lines;
    var openFenceIndent = -1;
    var inCode = false;
    var lastFenceLine = -

      forEachLine(function forLine(line, i) {
        line = line.replace('>', ' ');  // get rid of blockquotes
        line = line.replace(/```.*?```/g, 'reg');

        if (line.match(/```.*\{/)) {
          // addErrorContext(onError, i+1, lines[i].trim())
        }

        // var lineindent = line.search(/\S|$/)
        // var fenceindent = line.search('```')
        // var inline = false
        // if (line.search('````') >= 0) {
        //     addErrorContext(onError, i+1, lines[i].trim())
        // }
      });
  }
};
