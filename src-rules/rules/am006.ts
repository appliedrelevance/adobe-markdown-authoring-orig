// @ts-check

"use strict";

import { addErrorContext, ErrorContext, FilterParams, forEachLine } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
  "names": ["AM006", "dodgy-characters"],
  "description": "Detects invisible dodgy-characters and control characters",
  "tags": ["control-characters"],
  "function": function AM006(params: FilterParams, onError: (context: ErrorContext) => void) {
    // const dodgy = new RegExp("[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+(.+)[\xA0\x00-\x09\x0B\x0C\x0E-\x1F\x7F]+(.+)";
    forEachLine(function forLine(line, lineIndex) {
      const lineNumber = lineIndex + 1;
      if (line.match(/[\x00-\x08\x0A-\x0F]/)) {
        addErrorContext(onError, lineNumber, line);
      }
    });
  }
};
