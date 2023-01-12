"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
const admonitions_1 = require("./transform/admonitions");
const collapsible_1 = require("./transform/collapsible");
const dnls_1 = require("./transform/dnls");
const header_anchors_1 = require("./transform/header-anchors");
const link_targets_1 = __importDefault(require("./transform/link-targets"));
const shadebox_1 = require("./transform/shadebox");
const snippets_1 = require("./transform/snippets");
const table_styles_1 = require("./transform/table-styles");
const tabs_1 = __importDefault(require("./transform/tabs"));
const uicontrols_1 = require("./transform/uicontrols");
var TokenType;
(function (TokenType) {
    TokenType["BLOCKQUOTE_OPEN"] = "blockquote_open";
    TokenType["BLOCKQUOTE_CLOSE"] = "blockquote_close";
    TokenType["HTML_BLOCK"] = "html_block";
    TokenType["PARAGRAPH_OPEN"] = "paragraph_open";
    TokenType["PARAGRAPH_CLOSE"] = "paragraph_close";
    TokenType["INLINE"] = "inline";
    TokenType["HEADING_OPEN"] = "heading_open";
    TokenType["TABLE_OPEN"] = "table_open";
    TokenType["TABLE_CLOSE"] = "table_close";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
function adobeMarkdownPlugin(md, filePath) {
    md.use(injectTransforms, filePath);
    return md;
}
exports.default = adobeMarkdownPlugin;
function injectTransforms(md, filePath) {
    // Process the snippets first because they operate directly on the Markdown source instead of the tokens.
    md.core.ruler.before('normalize', 'include', (state) => { (0, snippets_1.includeFileParts)(state, filePath); });
    // Now add the token transforms.
    md.core.ruler.after('block', 'tabs', tabs_1.default);
    md.core.ruler.after('block', 'shadebox', shadebox_1.transformShadebox);
    md.core.ruler.after('block', 'collapsible', collapsible_1.transformCollapsible);
    md.core.ruler.after('block', 'table-styles', table_styles_1.transformTableStyles);
    md.core.ruler.after('block', 'tabs', tabs_1.default);
    md.core.ruler.after('block', 'dnls', dnls_1.transformDNLs);
    md.core.ruler.after('block', 'uicontrol', uicontrols_1.transformUICONTROLs);
    md.core.ruler.after('block', 'alert', admonitions_1.transformAdmonitions);
    md.core.ruler.after('block', 'header-anchors', header_anchors_1.transformHeaderAnchors);
    md.core.ruler.after('block', 'link-target', link_targets_1.default);
}
//# sourceMappingURL=index.js.map