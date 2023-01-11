"use strict";

import {
  addErrorContext,
  ErrorContext,
  FilterParams,
  forEachLine,
  isInCodeBlock,
} from "../shared";

export const am029 = {
  names: ["AM029", "git-merge-conflict-lines"],
  description: "Markdown source contains git merge conflict lines",
  tags: ["warnings", "git-merge-conflict"],
  function: function AM029(
    params: FilterParams,
    onError: (context: ErrorContext) => void
  ) {
    const codeBlockRe = new RegExp("```");
    var inCodeBlock = false;
    var isWarning = true;
    forEachLine(function forLine(line, lineIndex) {
      line = line.replace(/`{1}[^`].*?`{1}/, "CODE");
      const lineNumber = lineIndex + 1;
      inCodeBlock = isInCodeBlock(line, inCodeBlock);
      if (!inCodeBlock) {
        if (line.startsWith("<<<<<<< HEAD")) {
          addErrorContext(onError, lineNumber, line);
        }
      }
    });
  },
};
