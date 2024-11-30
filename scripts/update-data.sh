#!/usr/bin/env bash

set -euxo pipefail

# This script updates the ril100 data source

echo Downloading data from Deutsche Bahn
./scripts/download.py
echo Converting xlsx to csv
./scripts/convert.nu

# check for changes
if [[ `git status --porcelain` ]]; then
  git switch -c update-ril100
  git commit --all --message "Update ril100 data"
  git push --force origin update-ril100

  if [[ -z "$(gh pr list --head "update-ril100" --state open --json url --jq .[].url)" ]]; then
    gh pr create \
      --fill \
      --reviewer techtoto
  fi
fi
