const express = require('express');

const { Octokit } = require('@octokit/core');
const { paginateRest } = require('@octokit/plugin-paginate-rest');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const { GH_API_KEY } = process.env;

// GitHub Octkit rest client w/ automatic pagenation
const CustomOctokit = Octokit.plugin(paginateRest);
const octokit = new CustomOctokit({
  auth: GH_API_KEY
});

// sanitizes labels to just enhancement bugs or features
function sanitizeLabels(labels) {
  const cleanedLabels = [];
  labels.forEach(label => {
    label = label.toLowerCase();
    if (
      label === 'enhancement' ||
      label === 'feature' ||
      label === 'feature_request'
    ) {
      cleanedLabels.push('enhancement');
    } else if (label === 'bug') {
      cleanedLabels.push('bug');
    } else if (label === 'question') {
      cleanedLabels.push('question');
    }
  });
  return cleanedLabels;
}

// eslint-disable-next-line no-unused-vars
router.get(
  '/:owner/:repo',
  asyncHandler(async (req, res, next) => {
    const { owner, repo } = req.params;
    const { since } = req.query;

    if (since == null) {
      res.status(400).send({ error: 'missing since parameter' });
      return;
    }

    // See https://developer.github.com/v3/issues/#list-issues-for-a-repository
    const issuesAndPRs = await octokit.paginate(
      'GET /repos/:owner/:repo/issues',
      {
        owner,
        repo,
        since,
        per_page: 100
      }
    );

    // only include regular issues, remove pull requests
    const issues = issuesAndPRs.filter(issue => issue.pull_request == null);

    const formattedIssues = issues.map(issue => {
      return {
        title: issue.title,
        body: issue.body,
        issue_url: issue.html_url,
        repo_url: issue.repository_url,
        author: issue.login,
        labels: issue.labels.map(l => l.name),
        created_at: issue.created_at,
        closed_at: issue.closed_at
      };
    });

    // changes all issues into ONE OF bug enhancement question
    formattedIssues.forEach(issue => {
      issue.labels = sanitizeLabels(issue.labels);
    });

    const labeledIssues = formattedIssues.filter(
      issue => issue.labels.length !== 0
    );
    const unlabledIssues = formattedIssues.filter(
      issue => issue.labels.length === 0
    );

    res.send({ issues: labeledIssues });
  })
);

module.exports = router;
