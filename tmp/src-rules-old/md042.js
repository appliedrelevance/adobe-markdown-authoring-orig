// @ts-check

"use strict";

const shared = require("./shared");

const emptyLinkRe = /\[[^\]]*](?:\((?:#?|(?:<>))\))/;

const on = false  // turn on when ready

module.exports = {
  "names": [ "MD042", "no-empty-links" ],
  "description": "No empty links",
  "tags": [ "links" ],
  "function": function MD042(params, onError) {
    shared.filterTokens(params, "inline", function forToken(token) {
      let inLink = false;
      let linkText = "";
      let emptyLink = false;
      var linkTarget = "";
      token.children.forEach(function forChild(child) {
        if (child.type === "link_open") {
          inLink = true;
          linkText = "";
          child.attrs.forEach(function forAttr(attr) {
            if (attr[0] === "href") {
              linkTarget = attr[1];
              if (!attr[1] || (attr[1] === "#")) {
                emptyLink = true;
              }
            }
          });
        } else if (child.type === "link_close") {
          inLink = false;

          if (on) {
            if (linkText.trim() === '') {
              shared.addErrorContext(onError, child.lineNumber,
                "[" + linkText + "](" + linkTarget + ")", null, null,
                shared.rangeFromRegExp(child.line, emptyLinkRe));  
            }
          }
          if (emptyLink)  {
            shared.addErrorContext(onError, child.lineNumber,
              "[" + linkText + "](" + linkTarget + ")", null, null,
              shared.rangeFromRegExp(child.line, emptyLinkRe));
          }
        } else if (inLink) {
          linkText += child.content;
          // inLink = false;
        }
      });
    });
  }
};
