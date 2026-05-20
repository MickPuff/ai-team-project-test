# Bo Thong Residence: System Visualization & User Flows

This document visualizes the two sides of the digital transformation: the **Tenant Experience (Chinese Clients)** and the **Management Experience (Khun Aom & Staff)**.

---

## 1. Client Side: The Tenant QR Portal
**Goal:** Frictionless reporting without language barriers.

### The Flow:
1.  **Scan:** Tenant scans a sticker on their door with WeChat.
2.  **Portal Opens:** A mobile-friendly page appears in **Simplified Chinese**.
3.  **Report:** Tenant selects an icon (AC, Plumbing, etc.), types the issue in Chinese, and snaps a photo.
4.  **Confirm:** A green "Success" screen appears in Chinese.

### Visual Mockup (Mobile):
```text
+----------------------------+
|  博通公寓 - 租户服务 (ZH)  |  <-- Toggle to EN
+----------------------------+
| 房间号: 101                |
+----------------------------+
| 问题类型:                  |
| [空调] [电力] [水管] [家具] |  <-- Large Icons
+----------------------------+
| 描述问题:                  |
| "我的空调不冷了，漏水。"    |  <-- Chinese Input
+----------------------------+
| [ + 拍摄照片 ]             |
+----------------------------+
|      [ 提交报告 ]          |
+----------------------------+
```

---

## 2. Our Side: The Admin & Management Dashboard
**Goal:** Real-time visibility and automated operations.

### The Flow:
1.  **Alert:** Khun Aom receives a notification of a new request.
2.  **Review:** She sees the request translated: **"แอร์ไม่เย็นและมีน้ำหยด"** (Thai).
3.  **Action:** Khun Aom coordinates with the handyman (offline).
4.  **Update:** Once informed by the handyman that the job is finished, Khun Aom manually marks the task as **"Done"** in the dashboard.

### Visual Mockup (Desktop):
```text
+-------------------------------------------------------------+
|  Bo Thong Residence Dashboard            [Admin: Khun Aom]   |
+-------------------------------------------------------------+
| [ ROOMS ] [ MAINTENANCE (3 New) ] [ TENANTS ] [ REPORTS ]   |
+-------------------------------------------------------------+
|                                                             |
|  BLOCK VIEW (Spatial Layout)                                |
|  +---------+  +---------+  +---------+                      |
|  | B1: 101 |  | B1: 102 |  | B1: 103 |  <-- Green = OK      |
|  | [OCC]   |  | [VAC]   |  | [REPAIR]|  <-- Red = Repair    |
|  +---------+  +---------+  +---------+                      |
|                                                             |
|  LATEST REQUESTS:                                           |
|  - Room 101: แอร์ไม่เย็น (Auto-Translated)   [ Mark Done ]  |
|  - Room 305: ก๊อกน้ำเสีย                  [ Mark Done ]  |
|                                                             |
+-------------------------------------------------------------+
```

---

## 3. The Communication Bridge (The "Magic")
The system acts as the **Instant Middleman**:

| Step | Tenant (Chinese) | System Bridge | Manager (Thai) |
| :--- | :--- | :--- | :--- |
| **Input** | "厕所漏水" | Translate ZH -> TH | "ชักโครกรั่ว" |
| **Feedback** | "已收到报告" (Received) | Inform Tenant | "รับทราบ" (Acknowledge) |

---

## 4. Operational Note
Maintenance staff do not use the system. All digital status updates (In Progress -> Done) are handled exclusively by Khun Aom to maintain total control over the data quality.
