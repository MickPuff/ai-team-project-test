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

1. Start from the latest `main`.
2. Create a machine-specific feature branch.
3. Commit focused changes.
4. Push the branch.
5. Open a pull request into `main`.
6. Review, test, and merge.

Do not commit directly to `main` unless you are doing project setup or emergency repair.

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
