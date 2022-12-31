import * as fs from "fs";
import * as path from "path";
import StateCore from "markdown-it/lib/rules_core/state_core";

const INCLUDE_RE: RegExp = /\{\{\$include\s+(.+)\}\}/i;
const SNIPPET_RE: RegExp = /\{\{(.+)\}\}/i;
const SNIPPET_HEADER_RE: RegExp = /##\s+(.*)\{#(.*)\}/i;
const SNIPPET_FILE: string = 'help/_includes/snippets.md';
const INCLUDE_PATH: string = 'help/_includes';
const NOT_FOUND_MESSAGE: string = "File '{{FILE}}' not found.";
const CIRCULAR_MESSAGE: string = "Circular reference between '{{FILE}}' and '{{PARENT}}'.";

interface ISnippet {
    name: string;
    text: string;
    content: string;
}

interface ISnippetHash {
    [key: string]: ISnippet;
}

/**
 * Find all {{$include <path>}} tags and replace them with the contents of the named file.
 *  */
function replaceIncludes(
    src: string,
    rootdir: any,
    parentFilePath?: string,
    filesProcessed?: string[]
): string {

    filesProcessed = filesProcessed ? filesProcessed.slice() : []; // making a copy
    let cap, filePath, mdSrc, errorMessage; // store parent file path to check circular references
    if (parentFilePath) {
        filesProcessed.push(parentFilePath);
    }

    while ((cap = INCLUDE_RE.exec(src))) {
        let includePath = cap[1].trim();
        filePath = path.join(rootdir, includePath); // check if child file exists or if there is a circular reference
        if (!fs.existsSync(filePath)) {
            // child file does not exist
            errorMessage = NOT_FOUND_MESSAGE.replace('{{FILE}}', filePath);
        } else if (filesProcessed.indexOf(filePath) !== -1) {
            // reference would be circular
            errorMessage = CIRCULAR_MESSAGE
                .replace('{{FILE}}', filePath)
                .replace('{{PARENT}}', parentFilePath || '');
        }

        if (errorMessage) {
            // replace include with error message
            mdSrc = `\n\n# INCLUDE ERROR: ${errorMessage}\n\n`;
        } else {
            // get content of child file
            mdSrc = fs.readFileSync(filePath, 'utf8'); // check if child file also has includes
            mdSrc = replaceIncludes(
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

/**
 * // read the snippet file and parse the content between matching snippedHeaderRe regular expression, indexed by the
    // snippet name from the 2nd group of the regular expression.
 * @returns  {string} the content of the snippet file   
 */
function loadSnippetsFile(): ISnippetHash {
    const localSnippets: ISnippetHash = {};
    if (fs.existsSync(SNIPPET_FILE)) {
        const snippetContent = fs.readFileSync(SNIPPET_FILE, 'utf8');
        const snippetLines = snippetContent.split('\n');
        let snippet: ISnippet = { name: '', text: '', content: '' };
        let snippetName: string = '';
        snippetLines.forEach((line: { toString: () => string; }) => {
            const lineStr = line.toString().trim();
            const match = SNIPPET_HEADER_RE.exec(lineStr);
            if (match) {
                const text = match[1];
                snippetName = match[2];
                snippet = {
                    name: snippetName,
                    text: text,
                    content: ''
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

function replaceSnippets(src: string, rootDir: string): string {
    let snippets: ISnippetHash = loadSnippetsFile();
    if (!snippets) {
        return src;
    }

    let cap: RegExpExecArray | null;

    while ((cap = SNIPPET_RE.exec(src))) {
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

/**
 * 
 */
export function includeFileParts(state: StateCore) {
    const rootDir = ruleOptions.rootDir || INCLUDE_PATH;
    state.src = replaceIncludes(state.src, rootDir);
    state.src = replaceSnippets(state.src, rootDir);
}