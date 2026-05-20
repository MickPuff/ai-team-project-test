# Residential Finance Automation

Back office automation project for residential room finance, occupancy tracking, reporting, and owner/manager dashboards.

## Repository

GitHub: https://github.com/MickPuff/ai-team-project-test

## Product Goal

Create an internal system that helps a residential property company manage finance and operations data more easily.

The product should support:

- Room vacancy and occupancy tracking
- Income and expense tracking
- Finance summaries
- Operational reporting
- Data cleaning and spreadsheet import workflows
- Business dashboard views for owners, managers, finance, and operations teams

## Current Stage

Discovery preparation for stakeholder/data gathering on May 20, 2026.

Use these files tomorrow:

- [docs/discovery/2026-05-20-fieldwork-plan.md](docs/discovery/2026-05-20-fieldwork-plan.md)
- [docs/discovery/stakeholder-interview-guide.md](docs/discovery/stakeholder-interview-guide.md)
- [docs/discovery/data-inventory-template.md](docs/discovery/data-inventory-template.md)
- [docs/discovery/pain-points-log.md](docs/discovery/pain-points-log.md)
- [docs/discovery/reporting-requirements.md](docs/discovery/reporting-requirements.md)

## Team Workflow

Work happens through branches and pull requests.

1. Sync the local directory before every new instruction or task.
2. Start from the latest `main`.
3. Create a machine-specific feature branch.
4. Commit focused changes.
5. Push the branch.
6. Open a pull request into `main`.
7. Review, test, and merge.

Every machine must sync before reading files, making changes, or following a new instruction:

```powershell
.\scripts\sync-main.ps1
```

If a machine is working on a feature branch instead of `main`, it should still fetch first:

```powershell
git fetch origin
git status
```

Then update or rebase according to the branch owner/integration plan.

## Direct Main Commit Rule

Do not commit directly to `main` unless you are doing project setup, emergency repair, or a specifically approved coordination update.

Before any machine commits directly to `main`, including Mick's machine, it must show a confirmation prompt with:

1. A short recap of the files changed.
2. A short recap of the purpose of the change.
3. Any risk or coordination impact for other machines.
4. The exact commit message it plans to use.

Only commit to `main` after explicit confirmation.

Preferred workflow:

1. Sync first.
2. Create a machine-specific feature branch.
3. Commit and push the branch.
4. Open a pull request into `main`.

## Suggested Machine Branches

- `codex/integration`
- `gemini-1/business-process`
- `gemini-2/database-data`
- `gemini-3/dashboard-reporting`

Use more specific task branches when useful, for example:

```powershell
git checkout main
git pull
git checkout -b gemini-3/dashboard-wireframes
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

## Sync This Directory

To update a machine to the latest GitHub `main` commit:

```powershell
.\scripts\sync-main.ps1
```

The script stops if there are uncommitted local changes, so work is not accidentally mixed with incoming changes.
