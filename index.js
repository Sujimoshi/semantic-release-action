const core = require('@actions/core');
const github = require('@actions/github');
const sr = require('semantic-release')
const ca = require('@semantic-release/commit-analyzer')
const rng = require('@semantic-release/release-notes-generator')

;(async function() {
  const releaseBranches = core.getMultilineInput('release-branches').split('\n');
  const prereleaseBranches = core.getMultilineInput('prerelease-branches').split('\n').map(name => ({ name, prerelease: name.split(':')[1] || true }));

  const result = await sr({
    branches: [...releaseBranches, ...prereleaseBranches],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator'
    ]
  })
  
  if (!result) throw new Error('No release happened')
  core.setOutput('version', result.nextRelease.version)
  core.setOutput('notes', result.nextRelease.notes)
  core.setOutput('type', result.nextRelease.type)
  core.setOutput('tag', result.nextRelease.gitTag)
  core.setOutput('channel', result.nextRelease.channel)
  core.setOutput('name', result.nextRelease.name)

})().catch(err => core.setFailed(err.message))