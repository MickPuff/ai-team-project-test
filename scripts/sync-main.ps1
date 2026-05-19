param(
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$status = git status --porcelain
if ($status) {
    Write-Error "Working tree has uncommitted changes. Commit, stash, or discard them before syncing."
}

git fetch origin
git checkout $Branch
git pull --ff-only origin $Branch

Write-Host "Synced $Branch with origin/$Branch."
