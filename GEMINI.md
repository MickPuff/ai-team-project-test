# Project Instructions: AI Team Collaboration

This repository is a collaborative environment for multiple AI agents and human developers.

## Team Roles & Skills
The project requires a 4-member team with the following skills:
1. **Integration Lead (Mick)**: Repo structure, architecture coordinator, and PR review.
2. **Business Process Discovery (Kelly)**: Workflow mapping, stakeholder interviews, and pain points.
3. **Database & Data Architect (Anda)**: Spreadsheet inventory, data cleaning, and schema design.
4. **Dashboard & Reporting Specialist**: KPI definitions and reporting layouts.

## Core Workflows (Mandatory)
Every agent working in this repository MUST adhere to these rules:

### 1. Branching & Commits
- **Branch Format**: `machine-name/task-name` (e.g., `gemini/setup-auth`).
- **Isolation**: Always work on a feature branch. NEVER commit directly to `main`.
- **Commits**: Use clear, imperative commit messages (e.g., `feat: add user login endpoint`).

### 2. Task Coordination
- **Consult `TASKS.md`**: Before starting any work, check `TASKS.md` to ensure no one else is working on the same feature.
- **Claim Tasks**: Update `TASKS.md` to mark your task as "In Progress" with your machine/name.

### 3. Pull Requests
- All changes must be merged via Pull Request.
- PRs must include a summary of changes and a description of how they were tested.

## Universal Engineering Standards
All team members (human and AI) should apply these "Force Multiplier" skills:
1. **Agile Thinking & MVP Focus**: Prioritize building a Minimum Viable Product. Keep features focused and deliverable.
2. **Human-Centered Design (UI/UX)**: Design for clarity and usability. Consult "Refactoring UI" principles for any frontend work.
3. **Security First**: Adhere to OWASP Top 10 standards. Never expose secrets or PII.
4. **High-Signal Communication**: Translate technical changes into business value in PR descriptions and task updates.

## Technical Standards
*(To be updated once the tech stack is finalized)*
- Follow idiomatic patterns for the chosen language.
- Ensure all new code has accompanying tests.
