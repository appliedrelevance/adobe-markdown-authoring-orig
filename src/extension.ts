import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import { output } from './lib/common';
import adobeMarkdownPlugin from '../src-plugin';

const configSection = 'adobe-spectrum-markdown';

export function activate(context: vscode.ExtensionContext) {

	console.log('Activated extension "vscode-markdown-adobe"');
	return {
		extendMarkdownIt(md: MarkdownIt) {
			output.appendLine(
				`Markdown-it plugin options are ${JSON.stringify(
					md.options
				)}`
			);
			let plugin = adobeMarkdownPlugin(md);
			md.use(injectSpectrumTheme);
			return plugin;
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

const defaultSpectrumTheme = 'lightest';
const validSpectrumThemes = [
	'lightest',
	'light',
	'dark',
	'darkest',
];

function sanitizeSpectrumTheme(theme: string | undefined) {
	return typeof theme === 'string' && validSpectrumThemes.includes(theme) ? theme : defaultSpectrumTheme;
}

function injectSpectrumTheme(md: any) {
	const render = md.renderer.render;
	md.renderer.render = function () {
		const darkModeTheme = sanitizeSpectrumTheme(vscode.workspace.getConfiguration(configSection).get('darkModeTheme'));
		const lightModeTheme = sanitizeSpectrumTheme(vscode.workspace.getConfiguration(configSection).get('lightModeTheme'));
		return `<span id="${configSection}" aria-hidden="true"
                    data-dark-mode-theme="${darkModeTheme}"
                    data-light-mode-theme="${lightModeTheme}"></span>
                ${render.apply(md.renderer, arguments)}`;
	};
	return md;
}
