Please:
- [ ] Make your pull request atomic, fixing one issue at a time unless there are multiple relevant issues that would not make sense in isolation. For the latter case, please try to make atomic commits so we can easily review code for each issue.
- [ ] When you address our comments, please add additional commit(s) for the new changes so we can see just the new diff (instead of the whole PR's diff).  
- [ ] Provide a test case & update the documentation under `site/docs/`
- [ ] Make lint and test pass. (Run `yarn lint` and `yarn test`.  If your change affects Vega outputs of some examples, please run `yarn build:example EXAMPLE_NAME` to re-compile a specific example or `yarn build:examples` to re-compile all examples.)
- [ ] Make sure you have rebased onto the `master` branch.
- [ ] Provide a concise title so that we can just copy it to our release note.
  - Use imperative mood and present tense.
  - Mention relevant issues. (e.g., `#1`)
- [ ] Make a pass over the whole diff changes as if you're a reviewer yourself. This will help us focus on helping catching issues that you might not notice yourself.  (If you're still reviewing your PR, you can add "[WIP]" prefix to the PR's title and remove it when it's ready for a review and comment that the PR is ready.) 

Pro-Tip: https://medium.com/@greenberg/writing-pull-requests-your-coworkers-might-enjoy-reading-9d0307e93da3 is a nice article about writing a nice pull request.

