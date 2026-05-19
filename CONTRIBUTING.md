# Contributing

This repo is shared by multiple AI CLI machines. Keep changes small, branch-based, and easy to review.

## Branch Rules

- `main` is the stable branch.
- Each machine works on its own branch.
- Prefer branches named `machine-name/task-name`.
- Do not force push shared branches unless everyone using that branch agrees.

Examples:

```text
codex/integration
gemini-1/business-process
gemini-2/database-data
gemini-3/dashboard-reporting
```

## Before Starting Work

```powershell
git checkout main
git pull
git checkout -b machine-name/task-name
```

## Before Pushing

```powershell
git status
git diff
git add .
git commit -m "Clear, specific commit message"
git push -u origin machine-name/task-name
```

## Pull Requests

Every non-trivial change should go through a pull request into `main`.

Pull requests should include:

- What changed
- How it was tested
- Any files or areas other machines should avoid until merged

## Conflict Avoidance

Try to assign ownership before starting:

- Frontend files
- Backend files
- Tests
- Documentation
- Integration/configuration

If two machines need the same files, coordinate through `TASKS.md` or GitHub issues before editing.
