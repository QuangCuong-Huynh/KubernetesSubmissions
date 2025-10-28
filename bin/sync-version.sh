#!/bin/bash
set -e
VERSION=$(cat ../VERSION)
cd ..

#sycn version with /log_output
jq --arg ver "$VERSION" '.version = $ver' ./log_output/package.json > tmp.$$.json && mv tmp.$$.json ./log_output/package.json
git add package.json
git commit -m "chore: sync version to $VERSION in package.json"
git tag "v$VERSION"
echo "Synced version $VERSION across all submodules."
