# Architecture

Project architecture has not been selected yet. This file records the target shape so discovery can gather the right inputs.

## Candidate Product Modules

- Room and unit registry
- Occupancy status tracking
- Tenant/customer records
- Income tracking
- Expense tracking
- Spreadsheet import and cleanup
- Reporting pipeline
- Owner dashboard
- Manager dashboard
- Finance dashboard
- Operations dashboard
- Audit trail and permissions

## Candidate Data Entities

- Property
- Building or floor
- Room
- Occupancy period
- Tenant or resident
- Invoice or rent charge
- Payment
- Expense
- Vendor
- Maintenance or operations event
- Report snapshot
- User
- Role

## Open Technical Decisions

- Application stack
- Database
- Authentication model
- Hosting target
- Spreadsheet import format
- Dashboard/reporting framework
- Backup and audit requirements

## Ownership Boundaries

- Codex: integration, architecture, repo hygiene, review, cross-module consistency
- Gemini 1: business process, role workflows, pain points, current operating model
- Gemini 2: data inventory, database design, spreadsheet cleaning, import pipeline
- Gemini 3: dashboard/reporting requirements, KPI definitions, report layouts
