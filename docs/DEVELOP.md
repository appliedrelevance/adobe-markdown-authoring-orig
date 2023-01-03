# Developer guide for VSCode Markdown Adobe Extension

This is a major rewrite of the original VSCode Adobe Markdown Extension. Most of the improevements are
behind the scenes in consolidating several plugins into a single extension.

- Most of the extension is now coded in TypeScript.
- There is no longer an external "Adobe Markdown-it Plugin" dependency. The plugin is now part of the extension.
- The extension now uses the [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) for the UI.
- The extension now uses [Webpack](https://webpack.js.org/) to bundle the extension and its dependencies.
- The extension now uses [NPM](https://www.npmjs.com/) as the package manager for Node.js instead of Yarn because Webpack seems to prefer it that way.

## Prerequisites

- [Node.js](https://nodejs.org/en/) The core platform on which all VSCode extensions are built.
- [VSCode](https://code.visualstudio.com/) The editor used to develop VSCode extensions.
- [NPM](https://www.npmjs.com/) is the package manager for Node.js
- [Webpack](https://webpack.js.org/) The bundler that is used to package the extension and its dependencies.
- [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) The UI components used in the extension.

## Getting Started

Eventually, this extension will replace the current Adobe Markdown Extension. For now, it is a private repository hosted on the Applied Relevance GitHub account. To get started, you will need to clone the repository and install the dependencies.

```bash
git clone https://github.com/appliedrelevance/vscode-markdown-adobe.git
cd vscode-markdown-adobe
npm install
```

## How is the extension organized?

There are three main parts to the extension, each is contained in its own folder.

- ./src - The extension itself
- ./src-plugin - The Adobe Markdown-it Plugin
- ./src-preview - The Preview Webview web components and themes.

Each of the parts requires its own build process.  The webpack configuration files are located in the "build" folder.

- plugin.webpack.config.js - Configuration for building the Markdown-it Plugin.
- preview.webpack.config.js - Configuration for building the Preview Webview.
- shared.adobe.webpack.config.js - Shared configuration for all of the builds.
- webpack.config.js - Configuration for building the extension.

## Building the Extension

The extension is built using Webpack. The build process is defined in the `webpack.config.js` file. The build process will create a `dist` folder for the extension, a `dist-plugin` folder for the Markdown-it Plugin, and a `dist-preview` folder for the Preview Webview.

```bash
npm run build
```

## Debugging the Extension

The extension can be debugged using the VSCode debugger. The debugger is configured in the `.vscode/launch.json` file. The debugger will launch a new instance of VSCode with the extension installed.

## Markdown-it Plugin

In support of the markdown preview, the extension uses the Markdown-It plug-in system to convert Adobe Flavored Markdown directives into HTML. Each markdown component is defined in its own file under the `/src-plugin/transform/` folder. The `index.ts` file is the entry point for the plugin.  The `index.ts` file imports all of the components and registers them with the Markdown-it parser. The `index.ts` file also defines the `adobe` plugin.  The `adobeMarkdownPlugin` plugin is the entry point for the plugin.

> This extension no longer uses the independent [Adobe Markdown-it Plugin](https://www.npmjs.com/package/markdown-it-adobe-plugin).

### Adding a new Markdown-it transformation

To add a new Markdown-it transformation, create a new file in the `/src-plugin/transform/` folder. The file should export a function that takes a single parameter, the Markdown-it parser. Register the transform function with the Markdown-it parser in the `index.ts` file. 

The transform functions are registered in the order they are called. The order is important because the transforms are applied in the order they are registered.  That is why, for example, the includeFileParts transform is called before the 'normalize' transform, so that it can modify the action Markdown file before it is tokenized.  Each of the other transform functions modifies the `state.tokens` array directly, in the order in which they are called.  


```javascript
md.core.ruler.before('normalize', 'include', includeFileParts);
md.core.ruler.after('block', 'tabs', transformTabs);
md.core.ruler.after('block', 'shadebox', transformShadebox);
md.core.ruler.after('block', 'collapsible', transformCollapsible);
md.core.ruler.after('block', 'table-styles', transformTableStyles);
md.core.ruler.after('block', 'tabs', transformTabs);
md.core.ruler.after('block', 'dnls', transformDNLs);
md.core.ruler.after('block', 'uicontrol', transformUICONTROLs);
md.core.ruler.after('block', 'alert', transformAdmonitions);
md.core.ruler.after('block', 'header-anchors', transformHeaderAnchors);
md.core.ruler.after('block', 'link-target', transformLinkTargets);
```
