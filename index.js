const core = require('@actions/core');
const github = require('@actions/github');
const sr = require('semantic-release')
const ca = require('@semantic-release/commit-analyzer')
const rng = require('@semantic-release/release-notes-generator')

;(async function() {
  const config = {
    branches: core.getInput('branches').split('\n').map(branch => {
      return branch.startsWith('{ ') ? JSON.parse(branch) : branch
    }),
    plugins: core.getInput('plugins').split('\n'),
    noFailOnNothingToRelease: core.getInput('noFailOnNothingToRelease').toLowerCase().trim() === 'true'
  }

  console.log('Configuration', config)
  
  const result = await sr(config)
  
  if (!result) {
    const message = 'No release happened'
    if (noFailOnNothingToRelease) {
      console.log(message)
    } else {
      throw new Error(message)
    }
  }
  core.setOutput('version', result.nextRelease.version)
  core.setOutput('notes', result.nextRelease.notes)
  core.setOutput('type', result.nextRelease.type)
  core.setOutput('tag', result.nextRelease.gitTag)
  core.setOutput('channel', result.nextRelease.channel)
  core.setOutput('name', result.nextRelease.name)

})().catch(err => core.setFailed(err.message))
