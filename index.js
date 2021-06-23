const core = require('@actions/core');
const github = require('@actions/github');
const sr = require('semantic-release')
const ca = require('@semantic-release/commit-analyzer')
const rng = require('@semantic-release/release-notes-generator')

;(async function() {
  const releaseBranches = core.getInput('release-branches').split(',');
  const prereleaseBranches = core.getInput('prerelease-branches').split(',').map(name => ({ name, prerelease: true }));

  const result = await sr({
    branches: [...releaseBranches, ...prereleaseBranches],
    plugins: ['@semantic-release/commit-analyzer','@semantic-release/release-notes-generator']
  })

  console.dir({result}, { depth: null })
  
  if (!result) throw new Error('No release happened')
  core.setOutput('version', result.nextRelease.version)
  core.setOutput('notes', result.nextRelease.notes)
  core.setOutput('type', result.nextRelease.type)
  core.setOutput('tag', result.nextRelease.gitTag)
  core.setOutput('channel', result.nextRelease.channel)
  core.setOutput('name', result.nextRelease.name)

})().catch(err => core.setFailed(err.message))