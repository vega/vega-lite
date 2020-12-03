Please:

- [ ] Make the pull requests (PRs) atomic (fix one issue at a time). Multiple relevant issues that must be fixed together? Make atomic commits so we can easily review each issue.
- [ ] Provide a concise title as a [semantic commit message](https://www.conventionalcommits.org/) (e.g. "fix: correctly handle undefined properties") so we can easily copy it to the release note.
  - Use imperative mood and present tense.
- Mention relevant issues in the description (e.g., `Fixes #1` / `Fixes part of #1`).
- [ ] Lint and test (Run `yarn test`).
- [ ] If you send a pull request from a fork, make sure that GitHub actions run successfully. Make sure to add a [`GH_PAT` secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) for a [personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) with public repository permissions.
- [ ] Review your changes before sending the PR (to ensure code quality).
- For new features:
  - [ ] Add new unit tests.
  - [ ] Update the documentation under `site/docs/` + add examples.

Tips:

- https://medium.com/@greenberg/writing-pull-requests-your-coworkers-might-enjoy-reading-9d0307e93da3 is a nice article about writing a nice PR.
- Use draft PR for work in progress PRs / when you want early feedback (https://github.blog/2019-02-14-introducing-draft-pull-requests/).
