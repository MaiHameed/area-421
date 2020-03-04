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

const valid_issue_states = ['open', 'closed', 'all'];

// eslint-disable-next-line no-unused-vars
router.get(
  '/:owner/:repo',
  asyncHandler(async (req, res, next) => {
    const { owner, repo } = req.params;
    const { since, issue_state = 'all' } = req.query;

    if (!valid_issue_states.includes(issue_state.toLowerCase())) {
      res.status(400).send({ error: 'Invalid status filter' });
      return;
    }

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
        per_page: 100,
        state: issue_state
      }
    );

    // only include regular issues, remove pull requests
    const issues = issuesAndPRs.filter(issue => issue.pull_request == null);

    const formattedIssues = issues.map(issue => {
      return {
        id: issue.id,
        title: issue.title,
        body: issue.body,
        state: issue.state,
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

    res.send({ issues: {
      labeled: labeledIssues,
      unlabeled: unlabledIssues
    }});
  })
);

module.exports = router;
