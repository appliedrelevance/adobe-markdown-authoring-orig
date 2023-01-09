"use strict";

import { addErrorContext, ErrorContext, FilterParams, filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

const listItemMarkerInterruptsRe = /^[\s>]*(?:[*+-]|1\.)\s+/;
const blankOrListRe = /^[\s>]*($|\s)/;

module.exports = {
  "names": ["AM024", "List item bullet/numner on line by itself"],
  "description": "List items should contian content on bullet line",
  "tags": ["bullet", "ul", "ol"],
  "function": function AM024(params: FilterParams, onError: (context: ErrorContext) => void) {
    let inList = false;
    let prevLine = "";

    filterTokens(params, 'list_item_open', function forToken(token: MarkdownItToken) {
      // console.log(token)
      let match = /^[0-9*+-]+[\.]*$/.exec(token.line.trim());
      if (match) {
        addErrorContext(onError, token.lineNumber, token.line);
      }
    });
  }
};
