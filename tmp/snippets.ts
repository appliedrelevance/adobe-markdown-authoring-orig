import fs from 'fs';
import Core from 'markdown-it/lib/parser_core';
import path from 'path';

const INCLUDE_RE = /\{\{\$include\s+(.+)\}\}/i;
const SNIPPET_RE = /\{\{(.+)\}\}/i;
const SNIPPET_HEADER_RE = /##\s+(.*)\{#(.*)\}/i;
const SNIPPET_FILE = 'help/_includes/snippets.md';
const INCLUDE_PATH = 'help/_includes';
/**
 * Find all {{$include <path>}} tags and replace them with the contents of the named file.
 */
function replaceIncludeByContent(
  src: string,
  rootdir: string,
  parentFilePath: string,
  filesProcessed: string[]
) {
  filesProcessed = filesProcessed ? filesProcessed.slice() : []; // making a copy

  let cap, filePath, mdSrc, errorMessage; // store parent file path to check circular references

  if (parentFilePath) {
    filesProcessed.push(parentFilePath);
  }

  while ((cap = options.includeRe.exec(src))) {
    let includePath = cap[1].trim();
    filePath = path.join(rootdir, includePath); // check if child file exists or if there is a circular reference
    if (!fs.existsSync(filePath)) {
      // child file does not exist
      errorMessage = `${filePatn} does not exist`;
    } else if (filesProcessed.indexOf(filePath) !== -1) {
      // reference would be circular
      errorMessage = `Circular reference detected: ${filePath} is already included in ${parentFilePath}`;
    }

    if (errorMessage) {
      if (options.throwError) {
        throw new Error(errorMessage);
      }

      mdSrc = `\n\n# INCLUDE ERROR: ${errorMessage}\n\n`;
    } else {
      // get content of child file
      mdSrc = fs.readFileSync(filePath, 'utf8'); // check if child file also has includes
      mdSrc = replaceIncludeByContent(
        mdSrc,
        path.dirname(filePath),
        filePath,
        filesProcessed
      );
      // remove one trailing newline, if it exists: that way, the included content does NOT
      // automatically terminate the paragraph it is in due to the writer of the included
      // part having terminated the content with a newline.
      // However, when that snippet writer terminated with TWO (or more) newlines, these, minus one,
      // will be merged with the newline after the #include statement, resulting in a 2-NL paragraph
      // termination.
      const len = mdSrc.length;
      if (mdSrc[len - 1] === '\n') {
        mdSrc = mdSrc.substring(0, len - 1);
      }
    } // replace include by file content

    src =
      src.slice(0, cap.index) +
      mdSrc +
      src.slice(cap.index + cap[0].length, src.length);
  }

  return src;
}

function loadSnippetsFile() {
  // read the snippet file and parse the content between matching snippedHeaderRe regular expression, indexed by the
  // snippet name from the 2nd group of the regular expression.
  const localSnippets = {};
  const snippetFile = path.join(
    options.getRootDir(options),
    options.snippetFile
  );
  if (fs.existsSync(snippetFile)) {
    const snippetContent = fs.readFileSync(snippetFile, 'utf8');
    const snippetLines = snippetContent.split('\n');
    let snippet = {};
    let snippetName = '';
    snippetLines.forEach((line) => {
      const lineStr = line.toString().trim();
      const match = options.snippetHeaderRe.exec(lineStr);
      if (match) {
        const text = match[1];
        snippetName = match[2];
        snippet = {
          name: snippetName,
          text: text,
        };
        localSnippets[snippetName] = snippet;
      } else if (snippetName) {
        if (localSnippets[snippetName].content) {
          localSnippets[snippetName].content += '\n' + lineStr;
        } else {
          localSnippets[snippetName].content = lineStr;
        }
      }
    });
  }
  return localSnippets;
}

function replaceSnippetByContent(src, parentFilePath, filesProcessed) {
  // Make sure we've loaded the snippets before we try to replace them.
  if (!snippets) {
    snippets = loadSnippetsFile();
  }
  filesProcessed = filesProcessed ? filesProcessed.slice() : []; // making a copy

  let cap; // store parent file path to check circular references

  if (parentFilePath) {
    filesProcessed.push(parentFilePath);
  }

  while ((cap = options.snippetRe.exec(src))) {
    let snippetName = cap[1].trim();
    let mdSrc = snippets[snippetName]
      ? snippets[snippetName].content
      : `*** ERROR: Snippet ${snippetName} not found. ***`;
    src =
      src.slice(0, cap.index) +
      mdSrc +
      src.slice(cap.index + cap[0].length, src.length);
  }
  return src;
}

export default function includeFileParts(state, startLine, endLine): Core.RuleCore {
  state.src = replaceIncludeByContent(
    state.src,
    options.getRootDir(options, state, startLine, endLine)
  );
  state.src = replaceSnippetByContent(
    state.src,
    options.getRootDir(options, state, startLine, endLine)
  );
}