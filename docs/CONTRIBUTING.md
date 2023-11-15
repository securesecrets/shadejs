# ShadeJS Contributing Guide

Hi! We're really excited that you are interested in contributing to ShadeJS. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Pull Request Guidelines](#pull-request-guidelines)

## Pull Request Guidelines

- Checkout a topic branch from `develop`, and open pull requests against that branch. Develop is used as the staging branch for the next release. A release will be generated after merging develop -> main.

- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - Provide a detailed description of the bug in the PR.

- Commit messages must follow the [commit message convention](./COMMIT_CONVENTION.md).
- Ensure that the documentation [site](./.vitepress/config.ts) is updated to reflect your changes in the pull request.
- Please generate a [changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) for any PRs that impact the core ShadeJS code. The purpose of this is to automate version control and releases. This is not required for documentation changes only. You can run the following command for this: 
```
$ yarn changeset
```

## Development Setup

You can view the main [README](../README.md) for setup instructions