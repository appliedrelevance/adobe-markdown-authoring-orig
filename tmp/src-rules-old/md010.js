// @ts-check

"use strict";

const shared = require("./shared");

const tabRe = /\t+/;

module.exports = {
  "names": [ "MD010", "no-hard-tabs" ],
  "description": "Hard tabs",
  "tags": [ "whitespace", "hard_tab" ],
  "function": function MD010(params, onError) {
    const codeBlocks = params.config.code_blocks;
    const includeCodeBlocks = (codeBlocks === undefined) ? true : !!codeBlocks;

    var inCodeBlock = false

    shared.forEachLine(function forLine(line, lineIndex, inCode) {

        inCodeBlock = shared.inCodeBlock(line, inCodeBlock)
        if (tabRe.test(line) && !inCodeBlock && (!inCode || includeCodeBlocks)) {
            shared.addError(onError, lineIndex + 1,
            "Column: " + (line.indexOf("\t") + 1), null,
            shared.rangeFromRegExp(line, tabRe));
        }
    });
 }
};
