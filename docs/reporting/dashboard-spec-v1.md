# Dashboard Specification v1 (Bo Thong Residence)

This document outlines the layout and visual requirements for the digital transformation dashboards.

## 1. Owner Dashboard (Strategic View)
**Goal:** High-level health check of the business.

- **Header Metrics (Cards):**
  - Total Monthly Revenue (vs Target)
  - Current Occupancy Rate (%)
  - Net Profit (Estimated)
  - Pending Maintenance Costs

- **Visuals:**
  - **Occupancy Trend (Line Chart):** Last 12 months.
  - **Revenue Mix (Pie Chart):** Factory Contracts vs. Walk-ins.
  - **Expiring Contracts (Table):** List of top 5 bulk contracts ending soon.

## 2. Manager Dashboard (Khun Aom - Operational View)
**Goal:** Daily workflow management and room status.

- **Header Metrics (Cards):**
  - Vacant Rooms Today
  - Rooms Under Repair
  - New Maintenance Requests (Last 24h)

- **Visuals:**
  - **Room Map (Grid View):** 360-room color-coded grid (Green: Available, Red: Occupied, Yellow: Maintenance).
  - **Maintenance Queue (List):** Priority-sorted list of rooms needing action.
  - **Upcoming Check-ins/Check-outs (List):** For the next 48 hours.

## 3. Maintenance Analytics (Preventive View)
**Goal:** Transition from "Fix when broken" to "Maintain before failure".

- **Header Metrics (Cards):**
  - Average Repair Cost
  - Total Preventive Checks Done
  - Equipment Lifetime (Average)

- **Visuals:**
  - **High-Risk Rooms (Bar Chart):** Top 10 rooms with most frequent repairs.
  - **Common Failures (Pareto Chart):** Which equipment fails most (Aircon, Plumbing, etc.).
  - **Preventive Schedule (Calendar):** Upcoming scheduled cleanings/checks.

## 4. Technical Requirements
- **Data Source:** Bo Thong Database (WS3 tables).
- **Refresh Rate:** 1 hour (MVP).
- **Export Formats:** PDF, Excel (via joe/reports module).
