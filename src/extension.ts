import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import { output } from './lib/common';


export function activate(context: vscode.ExtensionContext) {
	console.log('Activated extension "vscode-markdown-adobe"');
	return {
		extendMarkdownIt(md: MarkdownIt) {
			output.appendLine(
				`Markdown-it plugin options are ${JSON.stringify(
					md.options
				)}`
			);
			return md;
			// 	.use(require('markdown-it-replace-link'), {
			// 		replaceLink: function (link: string, env: any) {
			// 			return makeRelativeLink(link);
			// 		},
			// 	})
			// 	.use(require('markdown-it-adobe-plugin'),
			// 		{
			// 			root: getRootFolder()?.uri.path,
			// 			throwError: false
			// 		});
		},
	};
}

// This method is called when your extension is deactivated
export function deactivate() { }
