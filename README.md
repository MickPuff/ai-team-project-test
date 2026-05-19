# AI Team Project Test

Shared project workspace for a multi-agent AI CLI team.

## Repository

GitHub: https://github.com/MickPuff/ai-team-project-test

## Team Workflow

Work happens through branches and pull requests.

1. Start from the latest `main`.
2. Create a machine-specific feature branch.
3. Commit focused changes.
4. Push the branch.
5. Open a pull request into `main`.
6. Review, test, and merge.

Do not commit directly to `main` unless you are doing project setup or emergency repair.

## Suggested Machine Branches

- `codex/integration`
- `gemini-1/frontend`
- `gemini-2/backend`
- `gemini-3/docs-tests`

Use more specific task branches when useful, for example:

```powershell
git checkout main
git pull
git checkout -b gemini-1/add-dashboard
```

## Basic Commands

Clone the project:

```powershell
git clone https://github.com/MickPuff/ai-team-project-test.git
cd ai-team-project-test
```

Start a new branch:

```powershell
git checkout main
git pull
git checkout -b machine-name/task-name
```

Commit and push:

```powershell
git status
git add .
git commit -m "Describe the change"
git push -u origin machine-name/task-name
```

Before opening or merging a pull request, make sure the project still runs and tests pass.
