"use strict";

import { addErrorContext, filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
  "names": ["AM001", "heading-title-starts-with-numbers"],
  "description": "Headings cannot contain numbers without named anchor {#..}",
  "tags": ["headings", "headers"],
  "function": function AM001(params: any, onError: any) {
    filterTokens(params, "heading_open", function forToken(token: MarkdownItToken) {
      let heading_title = token.line.replace(/.*?[#]+ /g, "");

      if (heading_title.match(/.*?\d+/) && !heading_title.match(/\{\#.*?\}$/)) {
        addErrorContext(onError, token.lineNumber, token.line);
      }
    });
  }
};
