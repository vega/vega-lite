<!--
## Got a Question or Problem ?

Please post these questions on our google group.  
-->

## Found an Issue or Want a Feature?

If you find a bug in the code or a mistake in the documentation or want a new feature, you can help us by creating an issue to [our repository](http://github.com/vega/vega-lite), or even better, submit a Pull Request with a fix (See [Development Guide](#dev) Below).  

Before creating an issue, please browse through the [issue list](https://github.com/vega/vega-lite/issues) to avoid duplicates.  

A good issue shouldn't leave others needing to chase you up for more information.  Here are properties of a good issue:

- __Use clear and descriptive title__ for the issue

- __Describe how to reproduce the issue__ If possible, please provide an example Vega-Lite specification for reproducing the issue.  

- __Provide screenshots/animated GIFs or describe the behavior you observed after following the steps__ and point out what exactly is the problem with that behavior.  Skitch is a useful tool for capturing screenshot. Github's issue tracker also supports drag-and-drop image upload.  

- __Explain which behavior you expected to see instead and why.__

# <a name="dev"></a> Development Guide

## Repository Setup

Make sure you have node.js. (For mac users, we recommend using
[homebrew](http://brew.sh) and simply run `brew install node`.)

Then, clone this repository and cd into your local clone of the repository, and install all the npm dependencies:

```sh
git clone https://github.com/vega/vega-lite.git
cd vega-lite
npm install
```

## Directory Structure

- `_layouts` – Our website and documentation's Jekyll layout files.  
- `bin` – Scripts for using Vega-Lite with command line.
- `data` – Example data.
- `docs` – Vega-Lite documentation.
- `examples` – Example Vega-Lite specification.  `examples/vlexamples.json` lists all of these examples.  
- `scripts` - Scripts for NPM commands.
- `site`- Misc files for serving the website and gallery
- `src` - source code.  `src/vl.ts` is the root file for Vega-Lite codebase that exports the global `vl` object.  General helpers methods are under `src`.  `src/compiler` contains all methods for compiler, which compiles Vega-Lite specs into Vega specs.  `src/schema` contains JSON schema and TypeScript interface declaration.  
- `test` - code for unit testing.  `test`'s structure reflects `src`'s' directory structure.  For example, `test/compiler` test files inside `src/compiler`.  
- `typings` - TypeScript typing declaration for dependencies.  Some of them are downloaded from the TypeStrong community.


## Commands

This section lists commands that are commonly used during development.  See `package.json` for other commands.

### Build

You can run `npm run build` to compile Vega-Lite and regenerate `vega-lite-schema.json`.

### Basic Lint & Test

`npm run lint` and `npm run test` run ts-lint and all unit-tests respectively.  These two commands are automatically run by `npm start` and `npm run watch`.

### Watch tasks

During development, it can be convenient to rebuild automatically or run tests in the background.

You can run `npm run start` to start a watcher task that shows the example gallery.
Whenever any `.ts` file changes, the watcher:
(1) re-compiles Vega-Lite
(2) automatically refreshes the gallery with BrowserSync
(3) lints and runs tests
(4) regenerates the JSON schema (`vega-lite-schema.json`)

If you only want subset of these actions, you can use:

- `npm run watch` to start a watcher task that do all of above except opening and syncing the gallery.

- `npm run watch:test` to start a watcher task that **lints and runs tests** when any `.ts` file changes.

- `npm run watch:build` to start a watcher task that **re-compiles Vega-Lite** when `.ts` files related to VL change.

### Output diff

We also have commands for observing changes in output Vega spec and output images.

To create baseline Vega output specs from the Vega-Lite specs in `examples/`,
check out the baseline branch (e.g., `git checkout master`) and run `npm x-compile`.
All compiled specs will be in `examples/_original`.

Once you develop some features and would like to diff the compiled specs, run `npm x-diff`.  
This will compile all examples again and output the diff for changed examples in the console.  
All compiled specs will be in `examples/_output`.  For changed examples,
SVG files will be created in `examples/_diff` for comparison.  
You can open those files to inspect visual changes, or run a diff command
(e.g., `diff examples/_diff/area-base.svg examples/_diff/area.svg`).

### Deployment

(For team members only) `npm run deploy` will publish latest code to npm and bower and also update github pages,
which contains our webpage and documentation.  If you want to update only github pages,
use `npm run deploy:gh`.  

To use any of these two commands, you will need to [install jq](https://stedolan.github.io/jq/download/)
i.e., running `brew install jq` if you use [homebrew](http://brew.sh) on mac.

## Suggested Programming Environment.

We use the [atom](atom.io) editor with the following plug-ins:
- `atom-typescript` - This provides us IDE-like features for TS inside Atom including renaming, go to definition, find all references.
- `linter` and `linter-tslint` – These shows tslint errors inside the editor.

__Tips:__ If you don't want to see intermediate files (`.js`, `.js.map`), you can "Hide VCS Ignored Files" in the `tree-view` plugin.

## Developing Vega-Lite and Datalib

Vega-Lite depends on [Datalib](https://github.com/vega/datalib).
If you plan to make changes to datalib and test Vega-Lite without publishing / copying compiled datalib all the time, use npm's [link](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) function.

```sh
# first link datalib global npm
cd path/to/datalib
npm link
# then link vega-lite to datalib
cd path/to/vega-lite
npm link datalib
```

Now all the changes you make in Datalib are reflected in your Vega-Lite automatically.

## Submitting a Pull Request

- All lint and test must pass.  Make sure to run `npm run lint` and `npm run test` before submitting a Pull Request.  

- For small fixes, please feel free to submit a pull request with appropriate test cases or example specs the demonstrate the use case.

TODO 
