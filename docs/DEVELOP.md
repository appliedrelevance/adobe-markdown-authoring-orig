# Developer guide for VSCode Markdown Adobe Extension

This is a major rewrite of the original VSCode Adobe Markdown Extension. Most of the improevements are
behind the scenes in consolidating several plugins into a single extension.

- Most of the extension is now coded in TypeScript.
- There is no longer an external "Adobe Markdown-it Plugin" dependency. The plugin is now part of the extension.
- The extension now uses the [Adobe Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) for the UI.
- The extension now uses [Webpack](https://webpack.js.org/) to bundle the extension and its dependencies.
- The extension now uses [NPM](https://www.npmjs.com/) as the package manager for Node.js instead of Yarn.

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


