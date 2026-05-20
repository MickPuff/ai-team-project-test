# Stakeholder Interview Guide (Kelly's Part - Gemini 1)

## 🎯 Objective
Extract high-signal data for both **Workstream 3 (Back Office)** and **Workstream 5 (Industrial IoT)**.

---

## 👔 Owner & Executive (Strategic Vision)
1. **The "Everything Dashboard":** "If you could see both your financial revenue and the real-time health of your factory machines on one screen, what decisions would that change?"
2. **Automation Priority:** "Which manual task costs you the most money right now? Is it billing errors or machine downtime?"

## 💰 Finance & Admin (Workstream 3 Focus)
1. **The Utility Billing Loop:** "How do you get the meter readings for electricity and water? Is someone walking to each meter? How often are there mistakes?"
2. **Payment Tracking:** "How do you know if a tenant has paid their bill? Does the bank send you an alert, or do you check manually?"

## 🛠 Maintenance & IT/OT (Workstream 5 Focus)
1. **The Hardware Landscape:** "What PLCs or Sensors are you currently using? (Modbus, S7, etc.)"
2. **Connectivity Status:** "Do these machines have an Ethernet port or Wi-Fi? Is there a central Kepware or SCADA server?"
3. **Data Access:** "Who currently has the 'Tag List' (addresses) for these machines? Can we get a copy?"
4. **Network Routing:** "Where is the main internet router? Is there space for a small IoT gateway (Node-RED) to be plugged in?"

## 🏢 Managers (Operational Reality)
1. **Occupancy Verification:** "How do you verify a room is actually vacant? Do you trust the paper log or do you have to physically check? Would a motion/power sensor help?"
2. **Maintenance Reporting:** "How do you currently report a broken pipe or machine? Who is notified?"

---

## 💡 Survey Expert Pro-Tips
- **Photograph ID Plates:** Take photos of any machine nameplates, PLC labels, or meter IDs.
- **Trace the Wires:** If you see a sensor, ask where the wire goes. Does it go to a PLC or a local display?
- **Screenshot Everything:** If they show you an existing SCADA or Excel screen, ask for a photo of it.
