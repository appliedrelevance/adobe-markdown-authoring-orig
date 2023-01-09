"use strict";

import { ErrorContext, FilterParams, filterTokens } from "../shared";
import { MarkdownItToken } from "markdownlint";

module.exports = {
    "names": ["AM015", "malformed-html-comment"],
    "description": "HTML comment malformed",
    "tags": ["html", "comment"],
    "function": function AM015(params: FilterParams, onError: (context: ErrorContext) => void) {
        const lines = params.lines;
        var fmlen = params.frontMatterLines.length;
        var inComment = false;
        var lastCommentStart = -1;

        var inCodeBlock = false;

        var htmlOpen = -1;
        var htmlClose = -1;


        forEachLine(function forLine(line, i) {
            line = line.replace(/`[^`].*`/, '');

            inCodeBlock = isInCodeBlock(line, inCodeBlock);

            if (!inCodeBlock && line.search(/<![-]*[>]+/) >= 0) {
                addErrorContext(onError, i + 1, lines[i].trim());
            }
        });
        forEachLine(function forLine(line, i) {
            line = line.replace(/`[^`].*`/, '');
            inCodeBlock = isInCodeBlock(line, inCodeBlock);

            if (!inCodeBlock) { //} && line.search(/<![-]*[>]+/) >= 0) {
                if (line.search(/<![-][-]*/) >= 0) {  // open comment
                    // console.log('html comment open ' + (i+1+fmlen).toString())
                    htmlOpen = i + 1;  // i+1+fmlen
                }
                if (line.search(/[-][-]*>/) >= 0) {
                    // console.log('html comment close ' + (i+1+fmlen).toString())
                    htmlOpen = -1;
                }

            }
        });
        if (htmlOpen !== -1) {
            addErrorDetailIf(onError, htmlOpen, null, 'Unclosed HTML comment', null);
        }

    }
};
function forEachLine(arg0: (line: any, i: any) => void) {
    throw new Error("Function not implemented.");
}

function addErrorContext(onError: (context: ErrorContext) => void, arg1: any, arg2: any) {
    throw new Error("Function not implemented.");
}

function isInCodeBlock(line: any, inCodeBlock: boolean): boolean {
    throw new Error("Function not implemented.");
}

function addErrorDetailIf(onError: (context: ErrorContext) => void, htmlOpen: number, arg2: null, arg3: string, arg4: null) {
    throw new Error("Function not implemented.");
}

