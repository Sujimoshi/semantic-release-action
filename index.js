const core = require('@actions/core');
const sematicRelease = require('semantic-release')
const github = require('@actions/github');

(async function() {
  const releaseBranches = core.getInput('release-branches').split(',');
  const prereleaseBranches = core.getInput('prerelease-branches').split(',').map(name => ({ name, prerelease: true }));

  const result = await require('semantic-release')({
    branches: [...releaseBranches, ...prereleaseBranches],
    plugins: ['@semantic-release/commit-analyzer','@semantic-release/release-notes-generator']
  })

  console.log({result})
  
  if (!result) throw new Error('No release happened')
  core.setOutput('version', result.nextRelease.version)

})().catch(err => core.setFailed(err.message))