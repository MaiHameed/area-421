const fetch = require('node-fetch');
const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

function cleanLabels(labels) {
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
router.post(
  '/:owner/:repo',
  asyncHandler(async (req, res, next) => {
    const { owner, repo } = req.params;
    const { since } = req.query;

    if (since == null) {
      res.status(400).send({ error: 'missing since parameter' });
      return;
    }

    const fetchURL = `https://api.github.com/repos/${owner}/${repo}/issues?since=${since}&per_page=100`;
    const ghRequest = await fetch(fetchURL);

    const issuesAndPRs = await ghRequest.json();

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
      issue.labels = cleanLabels(issue.labels);
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
