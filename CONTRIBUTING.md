# Contributing

If you find a bug in the code or a mistake in the [documentation](https://vega.github.io/vega-lite/docs/)
or want a new feature, you can help us by creating an issue to [our repository](http://github.com/vega/vega-lite),
or even better, submit a pull request.  

## Creating an Issue

Before creating an issue, please browse through the
[issue list](https://github.com/vega/vega-lite/issues) to avoid duplicates.  

A good issue shouldn't leave others needing to chase you up for more information.  
Here are properties of a good issue:

- __Use clear and descriptive title__ for the issue

- __Describe how to reproduce the issue__ If possible,
please provide an example Vega-Lite specification for reproducing the issue.  

- __Provide screenshots/animated GIFs or describe the behavior you observed
after following the steps__ and point out what exactly is the problem with that behavior.  
[Skitch](https://evernote.com/skitch) is a useful tool for capturing screenshots.
Github's issue tracker also supports drag-and-drop image upload.  

- __Explain which behavior you expected to see instead and why.__

## Submitting a Pull Request

You can contribute to our codebase by submitting
[a pull request](https://help.github.com/articles/using-pull-requests/).  
Here are some guides:

- Search GitHub for a related pull request. You don't want to duplicate effort.

- Before submitting a pull request:
  - All lint and test should pass.  
  - Run `npm run lint` and `npm run test`.  
  - Update the documentation under `docs/` to reflect the changes.
  - Make sure you have merged `master` into your branch.  If you are not a git command line ninja, we recommend [SourceTree](https://www.sourcetreeapp.com/).
  - Provide a concise description for the pull request so that we can copy the description and simply paste in  [our release note](https://github.com/vega/vega-lite/releases).  When writing description for a pull request or a commit, please:
    - Use imperative mood and present tense ([Why?](http://stackoverflow.com/questions/13861318/why-is-it-considered-good-practice-to-describe-git-commits-in-the-present-tense)).
    - Mention relevant issues using github's # syntax. (e.g., `#1` for mentioning issue #1)
    - Focus on _what_ and _why_ rather than _how_ 
    - See more [tips about git commit](http://chris.beams.io/posts/git-commit/).


- For small fixes, please feel free to submit a pull request
with appropriate test cases or example specs the demonstrate the use case.  
No worry about creating an issue first.  

- For major changes, please discuss with us via [our mailing list] and Github first,
so we can better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.

- Generally we name a branch using this pattern `<your 2-3 letters initial>/<topic>`.  
For example, @kanitw's branch regarding scale type might be called `kw/scale-type`.

- You can refer to related issue by adding #<issue-no> to the pull request's description.

### Looking for a Task to Contribute

[This document](http://bit.ly/vega-lite-contribute) lists tasks for contributors,
starting from smaller tasks to a larger task. You can also find
[all tasks with "help-wanted" label in the issue tracker](https://github.com/vega/vega-lite/labels/help-wanted).

## Documentation

Our documentation also resides in our Github repository under `docs/` in Markdown format.  
We use Github Pages to publish our documentation when we release a new version.
To contribute changes to the documentation, simply submit a pull request that changes
the corresponding markdown files in `docs/`.   

Since we only publish the Github Pages when we release a new version,
it might be slightly outdated compared to `master`.  
For development, once you have [setup the repository](#repository-setup),
you can run `npm run site` to serve the github page locally at [http://localhost:4000](http://localhost:4000).
Open [http://localhost:4000/docs](http://localhost:4000/docs) to see the docs.   


# Development Guide

## Repository Setup

1. Make sure you have node.js. (For mac users, we recommend using
[homebrew](http://brew.sh) and simply run `brew install node`.)

2. clone this repository and cd into your local clone of the repository, and install all the npm dependencies:

```sh
git clone https://github.com/vega/vega-lite.git
cd vega-lite
npm install
```

Now you should be able to build and test the code.

3. To make the gallery works, you need to install bower and its dependencies:

```sh
npm install -g bower
bower install 
```

4. To serve the website and documentation, you also have to [install Jekyll with Github Pages Gem](https://help.github.com/articles/using-jekyll-with-pages/#installing-jekyll).  
First, make sure you have ruby installed (If you do not, run `brew install ruby` on Mac will install it).
Then, run `gem install bundler`. Finally, simply run `bundle install` to install jekyll and its dependencies
(we already have the `Gemfile` in the repo).


## Directory Structure

- `_layouts/` – Our website and documentation's Jekyll layout files.  
- `bin/` – Scripts for using Vega-Lite with command line.
- `data/` – Example data.
- `docs/` – Vega-Lite documentation.
- `examples/` – Example Vega-Lite specification.  `examples/vlexamples.json` lists all of these examples.  
- `lib/` contains JSON schema's `schema.json`
- `scripts/` - Scripts for NPM commands.
- `site/` - Misc files for serving the website and gallery
- `src/` - Main source code directory.  
  - `src/vl.ts` is the root file for Vega-Lite codebase that exports the global `vl` object.
  Other files under `src/` reflect namespace structure.  
  All methods for `vl.xxx` will be in either `src/xxx.ts` or `src/xxx/xxx.ts`.  
  For example, `vl.channel.*` methods are in `src/channel.ts`.  
  `vl.compile` is in `src/compile/compile.ts`.
  - `src/schema/` contains JSON schema and TypeScript interface declaration.  
  We compile `schema` variable inside `src/schema/schema.ts` to generate the JSON schema.

- `test/` - Code for unit testing.  `test`'s structure reflects `src`'s' directory structure.  
For example, `test/compile/` test files inside `src/compile/`.  
  - Note that we prepend `/* tslint:disable:quotemark */` to all files under `test/compile`
  to allow putting JSON spec in tests directly without getting lint errors.
- `typings/` - TypeScript typing declaration for dependencies.  
Some of them are downloaded from the TypeStrong community.


## Commands

This section lists commands that are commonly used during development.  See `package.json` for other commands.

### Build

You can run `npm run build` to compile Vega-Lite and regenerate `vega-lite-schema.json`.

### Basic Lint & Test

`npm run lint` and `npm run test` run ts-lint and all unit-tests respectively.  These two commands are automatically run by `npm start` and `npm run watch`.

### Test Coverage

Use `npm run cover` to see test coverage summary and generate a report inside `coverage/lcov-report`.  
You can see if specific lines are covered in the unit test by running `open coverage/lcov-report/index.html`
and browse through the report.

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
check out the baseline branch (e.g., `git checkout master`) and run `npm
x-compile`. All compiled specs will be in `examples/_original`.

Once you develop some features and would like to diff the compiled specs, run `npm x-diff`.  
This will compile all examples again and output the diff for changed examples in the console.  
All compiled specs will be in `examples/_output`.  For changed examples,
SVG files will be created in `examples/_diff` for comparison.  
You can open those files to inspect visual changes, or run a diff command
(e.g., `diff examples/_diff/area-base.svg examples/_diff/area.svg`).

### Deployment

(For team members only) `npm run deploy` will publish latest code to NPM and Bower
and also update github pages, which contains our webpage and documentation.  
If you want to update only github pages,
use `npm run deploy:gh`.  

To use any of these two commands, you will need to [install jq](https://stedolan.github.io/jq/download/)
i.e., running `brew install jq` if you use [homebrew](http://brew.sh) on mac.

## Suggested Programming Environment.

We use the [atom](atom.io) editor with the following plug-ins:
- `atom-typescript` - This provides us IDE-like features for TS inside Atom including renaming, go to definition, find all references.
- `linter` and `linter-tslint` – These shows tslint errors inside the editor.  This is quite important since our Travis run includes linting too. Therefore, if your branch has a linting error, Travis test will fail too.  

__Tips:__ If you don't want to see intermediate files (`.js`, `.js.map`), you can "Hide VCS Ignored Files" in the `tree-view` plugin.

## Manually Testing with Vega-Editor

To manually test your changes locally, you should have a local instance of
[Vega Editor](https://github.com/vega/vega-editor) and link Vega-Lite to the editor  
(See [Vega Editor's README](https://github.com/vega/vega-editor#local-testing--debugging)
for instructions).

## Developing Vega-Lite and Datalib

Vega-Lite depends on [Datalib](https://github.com/vega/datalib).
If you plan to make changes to datalib and test Vega-Lite without publishing / copying compiled Datalib all the time, use [`npm link`](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) command.

```sh
# first link datalib global npm
cd path/to/datalib
npm link
# then link vega-lite to datalib
cd path/to/vega-lite
npm link datalib
```

Now all the changes you make in Datalib are reflected in your Vega-Lite automatically.

# Note

Vega-Lite enables a number of open-source applications including user interface tools ([PoleStar](https://github.com/uwdata/polestar) and [Voyager](https://github.com/uwdata/voyager)) and visualization recommender ([Compass](https://github.com/uwdata/compass)).  Look at their contribute pages if you are interested!

- [PoleStar: Contribute](https://github.com/uwdata/polestar/wiki/Contribute)
- [Voyager: Contribute](https://github.com/uwdata/voyager/wiki/Contribute)
- [Compass: Contribute](https://github.com/uwdata/compass/wiki/Contribute)

-----

**Acknowledgment**: This contribution guide is partly inspired by [angular.js's CONTRIBUTION.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).
