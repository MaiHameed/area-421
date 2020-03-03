const fetch = require('node-fetch');
const express = require('express');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.post('/:owner/:repo', async (req, res, next) => {
  const { owner, repo } = req.params;
  const { since } = req.query;

  const fetchURL = `https://api.github.com/repos/${owner}/${repo}/issues`;

  const issues = await (await fetch(fetchURL)).json();

  const cleanedIssues = issues.map(issue => )

  res.send({ issues });
});

module.exports = router;
