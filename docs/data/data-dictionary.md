# Data Dictionary

Status: Draft. Validate during discovery.

## Room

| Field | Meaning | Example | Notes |
| --- | --- | --- | --- |
| room_id | Unique room identifier | A-301 | Should not change |
| building | Building or property area | Building A | Optional if single building |
| floor | Floor number | 3 | |
| room_type | Room category | Standard | Confirm categories |
| status | Current status | occupied | Define allowed statuses |

## Occupancy

| Field | Meaning | Example | Notes |
| --- | --- | --- | --- |
| room_id | Room identifier | A-301 | Links to room |
| tenant_id | Resident/customer identifier | T-1001 | Confirm privacy requirements |
| start_date | Occupancy start | 2026-05-01 | |
| end_date | Occupancy end | 2026-05-31 | Blank if current |
| status | Occupancy status | active | |

## Income

| Field | Meaning | Example | Notes |
| --- | --- | --- | --- |
| income_id | Unique income record | INC-0001 | |
| room_id | Related room | A-301 | |
| date | Income date | 2026-05-05 | |
| category | Income category | rent | Confirm categories |
| amount | Income amount | 12000 | Confirm currency |
| payment_status | Status | paid | |

## Expense

| Field | Meaning | Example | Notes |
| --- | --- | --- | --- |
| expense_id | Unique expense record | EXP-0001 | |
| date | Expense date | 2026-05-06 | |
| category | Expense category | maintenance | Confirm categories |
| vendor | Vendor/person paid | ABC Repair | |
| amount | Expense amount | 2500 | Confirm currency |
| notes | Context | Air conditioner repair | |
