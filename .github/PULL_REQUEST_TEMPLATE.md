Please make sure you complete each of these steps before submitting an issue. 

- Make your pull request atomic, fixing one issue at a time unless there are many relevant issues that cannot be decoupled.

- All lint and test should pass.
- Run `npm run lint` and `npm run test`.
- Update the documentation under `site/docs/` to reflect the changes.

- Make sure you have merged `master` into your branch. If you are not a git command line ninja, we recommend [SourceTree](https://www.sourcetreeapp.com/).

- Provide a concise description for the pull request so that we can copy the description and simply paste in  [our release note](https://github.com/vega/vega-lite/releases). When writing description for a pull request or a commit, please:
  - Use imperative mood and present tense ([Why?](http://stackoverflow.com/questions/13861318/why-is-it-considered-good-practice-to-describe-git-commits-in-the-present-tense)).
  - Mention relevant issues using github's # syntax. (e.g., `#1` for mentioning issue #1)
  - Focus on _what_ and _why_ rather than _how_
  - See more [tips about git commit](http://chris.beams.io/posts/git-commit/).
  - Refer to related issue by adding #<issue-no> to the pull request's description.

- For small fixes, please feel free to submit a pull request
with appropriate test cases or example specs the demonstrate the use case.
No worry about creating an issue first.

- For major changes, please discuss with us via [our mailing list] and Github first,
so we can better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.

- Generally we name a branch using this pattern `<your 2-3 letters initial>/<topic>`.
For example, @kanitw's branch regarding scale type might be called `kw/scale-type`.


