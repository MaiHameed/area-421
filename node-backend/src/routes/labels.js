const express = require('express');
const axios = require('axios');

const { Octokit } = require('@octokit/core');
const { paginateRest } = require('@octokit/plugin-paginate-rest');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

const { GH_API_KEY, PREDICTOR_PORT, PREDICTOR_HOSTNAME } = process.env;

const PREDICTOR_API_ROOT = PREDICTOR_HOSTNAME
  ? `${PREDICTOR_HOSTNAME}:${PREDICTOR_PORT}`
  : 'localhost:8080';

// GitHub Octkit rest client w/ automatic pagenation
const CustomOctokit = Octokit.plugin(paginateRest);
const octokit = new CustomOctokit({
  auth: GH_API_KEY
});

const VALID_ISSUE_STATES = ['open', 'closed', 'all'];

const ENHANCEMENT_LABELS = [
  'enhancement',
  'feature',
  'feature_request',
  'kind/feature'
];

const BUG_LABELS = ['bug', 'kind/bug'];

const QUESTIONS_LABELS = ['question', 'kind/question'];

// sanitizes labels to just enhancement bugs or features
function sanitizeLabels(labels) {
  const cleanedLabels = [];
  labels.forEach(label => {
    // eslint-disable-next-line no-param-reassign
    label = label.toLowerCase();
    if (ENHANCEMENT_LABELS.includes(label)) {
      cleanedLabels.push('enhancement');
    } else if (BUG_LABELS.includes(label)) {
      cleanedLabels.push('bug');
    } else if (QUESTIONS_LABELS.includes(label)) {
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
    const { since, issue_state = 'all' } = req.query;

    if (!VALID_ISSUE_STATES.includes(issue_state.toLowerCase())) {
      res.status(400).send({ error: 'Invalid issue state filter' });
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
        closed_at: issue.closed_at,
        assignees: issue.assignees
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

    const predictionsResponse = await axios.post(
      `http://127.0.0.1:8080/predict`,
      {
        issues: unlabledIssues
      }
    );

    // console.log(predictionsResponse.data);

    res.send({
      issues: {
        labeled: labeledIssues,
        unlabeled: predictionsResponse.data.issues
      }
    });
  })
);

module.exports = router;
