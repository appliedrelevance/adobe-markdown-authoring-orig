import MarkdownIt from "markdown-it";
import transformTabs from "./transform/tabs";

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
    HTML_BLOCK = "html_block",
    PARAGRAPH_OPEN = "paragraph_open",
    PARAGRAPH_CLOSE = "paragraph_close",
    INLINE = "inline",
    HEADING_OPEN = "heading_open",
    TABLE_OPEN = "table_open",
    TABLE_CLOSE = "table_close",
}

export default function adobeMarkdownPlugin(
    md: MarkdownIt,
) {
    md.use(injectTransforms);
    return md;
}

function injectTransforms(md: MarkdownIt) {
    md.core.ruler.after('block', 'transform-tabs', transformTabs);
}

