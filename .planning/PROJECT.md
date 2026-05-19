# Project: Residential & Industrial Automation (Bo Thong & NIKOM)

## Summary

A unified automation system combining **Workstream 3 (Bo Thong Back Office)** and **Workstream 5 (NIKOM Industrial IoT)**. The system bridges the gap between physical hardware (Sensors/PLC) and business operations (Finance/Management) to create a "Digital Twin" of the property and industrial assets.

## Core Problem Statements

### Workstream 3: Bo Thong Back Office
Manual management of room occupancy, billing, income, and expenses leads to data silos, delays in reporting, and high operational friction for the owner and finance team.

### Workstream 5: NIKOM Industrial IoT
Industrial data from Sensors, PLCs, and SCADA systems (Modbus, S7, OPC UA) is fragmented. There is no central hub for real-time monitoring, dashboarding, or GIS mapping.

## Business Goals

- **Automate Everything:** Link hardware triggers (Workstream 5) directly to business outcomes (Workstream 3).
- **Real-Time Visibility:** Provide the Owner and Executives with live status of both financial performance and technical asset health.
- **Reduce Manual Entry:** Eliminate the need for staff to manually record meter readings or room occupancy status.
- **Standardized Reporting:** Unified dashboards for Owner, Finance, Management, and Maintenance.

## 7-Day Deliverables (Discovery Phase)

### Business (Workstream 3)
1. **As-Is Workflow:** Map from guest check-in to monthly reporting.
2. **Data Inventory:** List of all required tables (Rooms, Tenants, Payments, OT).
3. **Dashboard Mockup:** Owner's executive view.
4. **Pain Point List:** Document manual tasks for prioritized automation.

### Technical (Workstream 5)
1. **Research Note:** Node-RED implementation for PLC/Sensor connectivity.
2. **Technical Checklist:** Tag lists, PLC addresses, and network routing maps.
3. **MQTT Topic Structure:** Standardized pathing for device data.
4. **Payload Schema:** JSON structures for device messaging.
5. **Mock Demo:** Simulated end-to-end data flow (Sensor -> MQTT -> Dashboard).

## Team Roles

- **Codex (Lead):** Integration, Architecture, and Cross-Workstream Consistency.
- **Kelly (Gemini 1 - Lead):** Workstream 3 Lead (Business Process & Operations).
- **Gemini 2:** Workstream 5 Lead (IoT, Hardware, Node-RED, MQTT).
- **Gemini 3:** Integration & Data (Connecting IoT data to the Back Office database).
- **Gemini 4:** Visuals & Mapping (Dashboards, Grafana, & GIS Map).
