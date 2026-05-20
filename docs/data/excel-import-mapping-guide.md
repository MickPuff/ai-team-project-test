# Excel Data Import Mapping Guide
**Project:** Bo Thong Residence Digital Transformation
**Target Module:** Room Master & Maintenance History

To successfully import your existing Excel data into the new system, we need to map your current columns to our new database structure. Please use this guide when preparing the files.

## 1. Room Master List (Master Sheet)
This sheet defines all 480 rooms.

| New System Field | Expected Data | Example |
| :--- | :--- | :--- |
| `room_number` | Unique ID from the board | 101, 305, 4012 |
| `room_type` | Category | Single, Suite |
| `status` | Current condition | Available, Occupied, Repair |
| `amenities` | List of items (comma-separated) | Aircon, Bed, Fridge |
| `building_block` | Series from the board | 1000, 2000, etc. |

## 2. Maintenance History (Historical Sheet)
This sheet logs all past repairs.

| New System Field | Expected Data | Example |
| :--- | :--- | :--- |
| `room_number` | Must match Master List | 101 |
| `category` | Type of repair | Aircon, Plumbing |
| `description` | Details of the problem | "AC not cold, leak" |
| `cost` | Numeric value | 500.00 |
| `reported_date` | Date of request | 2026-05-15 |
| `status` | State of repair | Completed, Pending |
| `technician` | Who performed the fix | Somchai |

## 3. Data Cleaning Instructions
Before uploading the Excel files to the `uploads/` folder:
1. **Remove Empty Rows:** Ensure there are no blank rows between data.
2. **Consistent Room Numbers:** Ensure "Room 101" is always "101" and not "R101" in different sheets.
3. **Date Format:** Use a consistent date format (e.g., YYYY-MM-DD).

## Next Steps for Kelly:
1. Collect the latest Excel files from Khun Aom.
2. Upload them to the `uploads/` folder in this workspace.
3. I will then write a Python script (`scripts/import_excel.py`) to process them.
