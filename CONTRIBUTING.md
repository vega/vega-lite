# Contributing

If you find a bug in the code or a mistake in the [documentation](https://vega.github.io/vega-lite/docs/)
or want a new feature, you can help us by creating an issue to [our repository](http://github.com/vega/vega-lite),
or even better, submit a pull request.

- For small fixes, please feel free to submit a pull request. No worry about creating an issue first.

- For major changes, please discuss with us via [our mailing list](https://groups.google.com/forum/#!forum/vega-js) and Github first,
so we can better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project. 
  - One way to use GitHub for this purpose is to submit a pull request (PR) with a "[WIP]" prefix in the PR's title.  With a WIP PR, you can annotate your modification with questions. 

- Generally we name a branch using this pattern `<your 2-3 letters initial>/<topic>`.
For example, @kanitw's branch regarding scale type might be called `kw/scale-type`.

See our [issue](.github/ISSUE_TEMPLATE.md) and [pull request](.github/PULL_REQUEST_TEMPLATE.md) templates for more information.

### Looking for a Task to Contribute

[This document](http://bit.ly/vega-lite-contribute) lists tasks for contributors,
starting from smaller tasks to a larger task. You can also find
[all tasks with "help-wanted" label in the issue tracker](https://github.com/vega/vega-lite/labels/help-wanted).

## Documentation and Website

The website is under `site/` and the documentation is under `site/docs/`.
We use Github Pages to publish our documentation when we release a new version.
To contribute changes to the documentation or website, simply submit a pull request that changes
the corresponding markdown files in `site/`.

The images that are shown on the homepage and in the gallery have to be generated with `npm run build:images`.
To run the script, you need to install [gnu parallel](https://www.gnu.org/software/parallel/). (For Mac, you can simply do `brew install parallel`.)

Since we only publish the Github Pages when we release a new version,
it might be slightly outdated compared to `master`.
For development, once you have [setup the repository](#repository-setup),
you can run `npm run site` to serve the github page locally at [http://localhost:4000/vega-lite/](http://localhost:4000/vega-lite/).

# Development Guide

## Repository Setup

1. Make sure you have [node.js](https://nodejs.org/en/). For mac users, we recommend using [homebrew](http://brew.sh) and simply run:

  ```sh
  brew install node
  ```

2. Clone this repository and cd into your local clone of the repository, and install all the npm dependencies:

  ```sh
  git clone https://github.com/vega/vega-lite.git
  cd vega-lite
  npm install
  ```

  Now you should be able to build and test the code.

3. To make the gallery work, you need to install [bower](http://bower.io/) and its dependencies:

  ```sh
  npm install -g bower
  bower install
  ```

4. To serve the website and documentation, you will need [ruby](https://www.ruby-lang.org/en/), [bundler](http://bundler.io/) and [Jekyll](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/).

  For ruby, Mac users can use [homebrew](http://brew.sh) to add it:
  ```sh
  brew install ruby
  ```

  For bundler:
  ```sh
  gem install bundler
  ```

  For jekyll and its dependencies, because we already have the `Gemfile` in the repo, you can simply run:
  ```sh
  bundle install
  ```

## Directory Structure

- `_layouts/` – Our website and documentation's Jekyll layout files.
- `bin/` – Scripts for using Vega-Lite with command line.
- `data/` – Example data.
- `site/` – Vega-Lite website including documentation.
- `examples/` – Example Vega-Lite specifications.
  - `examples/vl-examples.json` lists all examples under `examples/`. Similarly, `examples/docs/vl-docs-examples.json` lists all examples under `examples/docs`.

- `lib/` contains JSON schema's `schema.json`
- `scripts/` - Scripts for NPM commands.
- `site/` - Misc files for serving the website and gallery
- `src/` - Main source code directory.
  - `src/vl.ts` is the root file for Vega-Lite codebase that exports the global `vl` object.
  Other files under `src/` reflect namespace structure.
  All methods for `vl.xxx` will be in either `src/xxx.ts` or `src/xxx/xxx.ts`.
  For example, `vl.channel.*` methods are in `src/channel.ts`.
  `vl.compile` is in `src/compile/compile.ts`.
  - All interface for Vega-Lite syntax should be declared at the top-level of the `src/` folder.

- `test/` - Code for unit testing. `test`'s structure reflects `src`'s' directory structure.
For example, `test/compile/` test files inside `src/compile/`.
  - Note that we prepend `/* tslint:disable:quotemark */` to all files under `test/compile`
  to allow putting JSON spec in tests directly without getting lint errors.
- `typings/` - TypeScript typing declaration for dependencies.
Some of them are downloaded from the TypeStrong community.


## Commands

This section lists commands that are commonly used during development. See `package.json` for other commands.

### Build

You can run `npm run build` to compile Vega-Lite and regenerate `vega-lite-schema.json`.

### Basic Lint & Test & Test Coverage

`npm run lint` and `npm run test` run ts-lint and all unit-tests respectively. These two commands are automatically run by `npm start` and `npm run watch`.

Running `npm run test` automatically includes test coverage summary and generates a report inside `coverage/index.html`.
You can see if specific lines are covered in the unit test by running `open coverage/index.html`
and browse through the report.

A lot of linting errors can be fixed automatically with running `npm run lint -- --fix`.

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

### Website

`npm run site`. See details in [Documentation and Website](#documentation-and-website).

### Deployment

(For team members only) `npm run deploy` will publish latest code to NPM and Bower
and also update github pages, which contains our webpage and documentation.
If you want to update only github pages,
use `npm run deploy:gh`.

## Suggested Programming Environment.

We use the [Visual Studio Code](http://code.visualstudio.com/) editor with TSLint plugin. 
- VSCode has a nice built-in Typescript support!
- We already include project settings to hide compiled files  (`*.js`, `*.js.map`).  This should work automatically if you open the vega-lite folder with VSCode.  

## Manually Testing with Vega-Editor

To manually test your changes locally, you should have a local instance of
[Vega Editor](https://github.com/vega/vega-editor) and link Vega-Lite to the editor
(See [Vega Editor's README](https://github.com/vega/vega-editor#local-testing--debugging)
for instructions).

## Developing Vega-Lite and Vega-Util

Vega-Lite depends on [vega-util](https://github.com/vega/vega-util).
If you plan to make changes to datalib and test Vega-Lite without publishing / copying compiled vega-util all the time, use [`npm link`](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) command.

```sh
# first link datalib global npm
cd path/to/vega-util
npm link
# then link vega-lite to datalib
cd path/to/vega-lite
npm link vega-util
```

Now all the changes you make in vega-util are reflected in your Vega-Lite automatically.

## Pull Requests and Travis
All pull requests will be tested on [Travis](https://travis-ci.org/). If your PR does not pass the checks, your PR will not be approved. Travis' environments will run `npm run test`, generate vega specs from your updated code, compare it with the vega specs in `examples/vg-specs/`, and check code coverage of your code.  (See `.travis.yml` for all commands it executes.) If you don't want your PR reviewed until Travis checks pass, just prepend `[WIP]` to the title of your PR.Once you're ready for review, remove the `[WIP]` prefix and comment that the PR is ready for review. 

### Code Coverage
When checking for code coverage, we require that your PR tests covers at least the same percentage of code that was being covered before. To check the code coverage, you can see the link in the job log of your Travis test, from the Github page of your PR or `https://codecov.io/gh/vega/vega-lite/commits`. It'll be usually in the form of `https://codecov.io/gh/vega/vega-lite/commit/your-full-head-commit-number`. Under the *Files* and *Diff* tab, you can check your code coverage differences and total. In *Files*, you can check which lines in your files are being tested (marked in green) and which are not (marked in red). We appreciate PRs that improve our overall code coverage!

# Note

Vega-Lite enables a number of open-source applications including user interface tools ([PoleStar](https://github.com/uwdata/polestar) and [Voyager](https://github.com/uwdata/voyager)) and visualization recommender ([Compass](https://github.com/uwdata/compass)). Look at their contribute pages if you are interested!

- [PoleStar: Contribute](https://github.com/uwdata/polestar/wiki/Contribute)
- [Voyager: Contribute](https://github.com/uwdata/voyager/wiki/Contribute)
- [Compass: Contribute](https://github.com/uwdata/compass/wiki/Contribute)

-----

**Acknowledgment**: This contribution guide is partly inspired by [angular.js's CONTRIBUTION.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).
