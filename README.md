# Semantic Release Version Evaluator

Evaluate the next release version for your GitHub repositories with this GitHub Action.

## Description

This GitHub Action automatically evaluates the next release version for your repository based on semantic versioning and using your commit messages and configured release branches. 

IMPORTANT:
> This action does not create any releases or tags. Instead, it provides output variables with information about the evaluated release, such as the version, type, tag, channel, name and changelog. So you need to create a tag by yourself in order to evaluate next version. See [Example](.github/workflows/release.yml)

## Inputs

### `branches`

A set of release branches separated by a newline.

* Default:
```
+([0-9])?(.{+([0-9]),x}).x
master
next
next-major
{ "name": "alpha", "prerelease": true }
{ "name": "beta", "prerelease": true }
```

### `plugins`

A set of plugins to use for semantic-release.

* Default:
```
@semantic-release/commit-analyzer
@semantic-release/release-notes-generator
```

### `tagFormat`

The Git tag format used by semantic-release to identify releases.

* Default: `v${version}`

## Outputs

### `version`

The next release version.

### `notes`

The release notes.

### `type`

The release type (minor, major, or patch).

### `tag`

The tag name.

### `channel`

The channel name.

### `name`

The release name.

## Example Usage

```yaml
name: Semantic Release Version Evaluator

on:
  push:
    branches:
      - master

jobs:
  semantic-release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Evaluate next release version
      id: release
      uses: Sujimohi/semantic-release-action@v1
      with:
        branches: |
          +([0-9])?(.{+([0-9]),x}).x
          master
          next
          next-major
          { "name": "alpha", "prerelease": true }
          { "name": "beta", "prerelease": true }
        plugins: |
          @semantic-release/commit-analyzer
          @semantic-release/release-notes-generator
        tagFormat: 'v${version}'
      
    - name: Get the output
      run: |
        echo "Version: ${{ steps.release.outputs.version }}"
        echo "Tag: ${{ steps.release.outputs.tag }}"
        echo "Name: ${{ steps.release.outputs.name }}"
        echo "Notes: ${{ steps.release.outputs.notes }}"
        echo "Type: ${{ steps.release.outputs.type }}"
        echo "Channel: ${{ steps.release.outputs.channel }}"
```

License
This project is licensed under the MIT License.