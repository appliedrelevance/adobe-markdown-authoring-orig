import StateCore from 'markdown-it/lib/rules_core/state_core';
import Token from 'markdown-it/lib/token';
import { TokenType } from '..';



export default function transformTabs(state: StateCore) {
    let tokens: Token[] = state.tokens;
    let tabRe = /\[!BEGINTABS\]/;
    let tabsGoHere = 0;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token.type !== 'blockquote_open') {
            continue;
        } else {
            // We are in a Blockquote. The next token should be a paragraph.
            let nextToken = tokens[i + 1];
            if (nextToken.type !== 'paragraph_open') {
                continue;
            }
            // The next token should be an inline token.
            let nextNextToken = tokens[i + 2];
            if (nextNextToken.type === 'inline') {
                let text = nextNextToken.content;
                // Find the opening line.
                let match = tabRe.exec(text);
                if (match) {
                    // Replace all of the totkens that make up the opening [!BEGINTABS] line with a single html_block token.
                    let newToken = new Token('html_block', `<div class="sp-wrapper"><sp-tabs
                    selected="1"
                    size="l"
                    direction="horizontal"
                    dir="ltr"
                    focusable=""
                  >`, 0);
                    tokens.splice(i, 5, newToken);
                    i++;
                    tabsGoHere = i;
                }
            }
        }
        // Find the next blockquote_open that has a paragraph_open and an inline token with a [!TAB ...] line, or
        // an [!ENDTABS] line.
        let tabTitleRe = /\[!TAB\s+(.*)\]/;
        let endTabsRe = /\[!ENDTABS\]/;
        let tabTitle = '';
        let tabTitles = [];
        let tabCount = 0;

        while (i < tokens.length) {
            let nextToken = tokens[i];
            // Sklp over any tokens that are not blockquote_open
            if (nextToken.type !== 'blockquote_open') {
                i++;
                continue;
            }
            // The next token better be a paragraph_open.
            let paraToken = tokens[i + 1];
            if (paraToken.type !== 'paragraph_open') {
                i++;
                continue;
            }
            // The next token better be an inline token.
            let inlineToken = tokens[i + 2];
            if (inlineToken.type !== 'inline') {
                i++;
                continue;
            }
            // We have a blockquote_open, paragraph_open, and inline token.  Look for a [!TAB ...] line or an [!ENDTABS]
            // line.
            let text = inlineToken.content;
            let match = tabTitleRe.exec(text);
            if (match) {
                // We have a [!TAB ...] line.  Save the tab title and the tab content.
                tabTitle = match[1];
                tabTitles.push(tabTitle);
                // tabId = tabIdPrefix + tabCount;
                tabCount++;
                let spTabPanelStart = `<sp-tab-panel 
    value="${tabCount}"
    dir="ltr" 
    slot="tab-panel" 
    role="tabpanel" 
    tabindex="-1" 
    id="sp-tab-panel-${tabCount - 1}"
    aria-labelledby="sp-tab-${tabCount - 1}" 
    aria-hidden="true">`;
                let newToken = new Token('html_block', spTabPanelStart, 0);
                tokens.splice(i, 5, newToken);
                i++;
                // Everything up to the next blockquote_open is the tab content.  Leave it alone.
                // Find the next blockquote_open.
                while (i < tokens.length) {
                    nextToken = tokens[i];
                    if (nextToken.type === 'blockquote_open') {
                        // Insert the </sp-tab-panel> closing.
                        let spTabPanelEnd = '</sp-tab-panel>';
                        let newToken = new Token('html_block', spTabPanelEnd, 0);
                        tokens.splice(i, 0, newToken);
                        break;
                    }
                    i++;
                }
            } else {
                // We don't have a [!TAB ...] line.  Look for an [!ENDTABS] line.
                match = endTabsRe.exec(text);
                if (match) {
                    // We have the [!ENDTABS] line.  Replace it with the closing </div> tag.
                    inlineToken.content = '</sp-tabs></div>';
                    inlineToken.type = 'html_block';
                    // Remove the paragraph_open and paragraph_close tokens.
                    tokens.splice(i + 1, 2);
                    // Remove the blockquote_open token.
                    tokens.splice(i, 1);
                    const tabHeaders = tabTitles.map((tabLab, index) => {
                        const tabContent = `<sp-tab
                        label="${tabLab}"
                        value="${index + 1}"
                        dir="ltr"
                        role="tab"
                        id="sp-tab-${index + 1}"
                        aria-selected="true"
                        tabindex="-1"
                        aria-controls="sp-tab-panel-${index + 1}"
                        selected=""
                      ></sp-tab>`;
                        return new Token('html_block', tabContent, 0);
                    });
                    tokens.splice(tabsGoHere, 0, ...tabHeaders);
                    break;
                }
            }
            i++;
        }
        // appendSpectrumTabs(state);
    }
}