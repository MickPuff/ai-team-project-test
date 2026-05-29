# Feature Spec: Digital Deposit Settlement (Kelly's Part)

## Objective
Automate the "Universal Deposit" reconciliation process to reduce manual calculation errors and speed up tenant move-outs.

## Core Logic
- **Universal Buffer:** The `deposit_amount` in the `Contract` model acts as the starting balance.
- **Automated Deductions:** 
    - **Utilities:** Monthly electricity/water inputs create `Deduction` records.
    - **Cleaning:** Standard move-out fee triggered by status change to `AVAILABLE`.
    - **Damages:** Maintenance requests marked as `COMPLETED` can be flagged for deposit deduction.

## UI Components (Frontend)
- **Settlement View:** A dedicated page per room showing a line-item ledger of all deductions vs. the initial deposit.
- **Evidence Carousel:** Displaying "Before/After" photos from maintenance requests to justify deductions.
- **Final Statement Generator:** A "Generate PDF" button for the tenant settlement statement.

## Data Flow
1. **Deduction Event:** (e.g., Meter reading entered).
2. **Database Update:** Create record in `deductions` table linked to `contract_id`.
3. **Ledger Update:** Subtract `amount` from virtual `current_balance` on the dashboard.
4. **Final Closure:** On contract termination, calculate `deposit_amount - sum(deductions)`.

## Stakeholder Benefits
- **Khun Aom:** No more manual math or hunting through Excel files.
- **Tenants:** Clear, translated evidence for why money was deducted (reduces disputes).
- **Owner:** Real-time visibility into deposit liabilities.
