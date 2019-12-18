# github-stats

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg)](https://github.com/marius-joe/github-stats/graphs/commit-activity)
[![GitHub issues](https://img.shields.io/github/issues/marius-joe/github-stats.svg)](https://github.com/marius-joe/github-stats/issues/)
[![GitHub license](https://img.shields.io/github/license/marius-joe/github-stats.svg)](https://github.com/marius-joe/github-stats/blob/master/LICENSE)
[![Build PROD](https://img.shields.io/github/workflow/status/marius-joe/github-stats/GCloudRunDeployment_PROD?label=build%20PROD)](https://github.com/marius-joe/github-stats/actions?query=workflow%3AGCloudRunDeployment_PROD)
[![Build DEV](https://img.shields.io/github/workflow/status/marius-joe/github-stats/GCloudRunDeployment_DEV?label=build%20DEV)](https://github.com/marius-joe/github-stats/actions?query=workflow%3AGCloudRunDeployment_DEV)

**Simple API to retrieve statistics about GitHub users &amp; their repositories**

In this example API a proxy API to GitHub has been build with NodeJS and the [Loopback 4 TypeScript framework](https://loopback.io/doc/en/lb4/)\
Currently the API provides following features:

-   list filtered information about a GitHub user's own repositories using a custom REST datasource + service
-   error handling when the user cannot be found via parsing GitHub errors and configuring a custom 'reject' Sequence Action
-   error handling when the GitHub API is not reachable
-   error handling for unsupported header values in an incoming request

The application can be started via a docker container and using this a deployment to [Google Cloud Run](https://github.com/ahmetb/cloud-run-faq) is triggered on every 'push' to the branches 'master' and 'dev' via configured [GitHub Actions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions): [My Workflows](https://github.com/marius-joe/github-stats/tree/feat/github-unknown-user/.github/workflows)
