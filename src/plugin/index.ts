import MarkdownIt from "markdown-it";
import fs from "fs";
import path from "path";

import transformLinkTargets from "./transform/link-targets";

export interface PluginOptions {
    root?: string;
    includeRe?: string;
    includePath?: string;
    snippetRe?: string;
    snippetHeaderRe?: string;
    collapsibleRe?: string;
    snippetFile?: string;
    throwError?: boolean;
    bracesAreOptional?: boolean;
    notFoundMessage?: string;
    circularMessage?: string;
}

export enum TokenType {
    BLOCKQUOTE_OPEN = "blockquote_open",
    BLOCKQUOTE_CLOSE = "blockquote_close",
    PARAGRAPH_OPEN = "paragraph_open",
    PARAGRAPH_CLOSE = "paragraph_close",
    INLINE = "inline",
    HEADING_OPEN = "heading_open",
    TABLE_OPEN = "table_open",
    TABLE_CLOSE = "table_close",
}

export default function adobeMarkdownPlugin(
    md: MarkdownIt,
    options: PluginOptions
) {
    return (md: MarkdownIt, options: PluginOptions) => {
        md.core.ruler.after("block", "link-target", transformLinkTargets);
    };
}
