# Data Inventory: Bo Thong Residence

## Source Name: Maintenance History Excel

Owner: Khun Aom (Operations Manager)

Current location: Operations Office (Local PC / USB)

Format: .xlsx

Update frequency: Daily / Reactive

Who updates it: Khun Aom (based on staff verbal reports/paper notes)

Who consumes it: Khun Aom, Owner (periodic review)

## Business Purpose

Track repair history per room and total maintenance spend. Used to decide when to replace vs. repair assets like AC units.

## Columns Or Fields

| Field | Meaning | Example | Required | Problems |
| --- | --- | --- | --- | --- |
| Date | Date of repair | 2026-05-15 | Yes | |
| Room Number | Unique ID | 4102 | Yes | |
| Issue | Description | AC not cooling | Yes | Inconsistent descriptions |
| Cost | Parts/Labor | 1,500 THB | Yes | Hard to aggregate |
| Status | Progress | Done | Yes | Only "Done" is usually recorded |

## Data Quality Notes

- Missing values: Frequent for older records.
- Duplicate records: Occasional re-entry of same issue.
- Inconsistent names: "AC", "Air", "Aircon" all used.
- Date format issues: Thai Buddhist calendar vs Western calendar inconsistencies.
- Manual cleanup steps: Requires standardization of issue categories.

## Automation Opportunity

Digitize reporting via mobile-friendly QR portal for tenants and staff to log issues directly into the central database, eliminating the Excel middleman.
