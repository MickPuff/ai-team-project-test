---
phase: 4
slug: dashboard-map-replication
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-20
---

# Phase 4 — UI Design Contract (Map Replication)

> Visual and interaction contract for replicating the physical whiteboard map layout exactly as requested by the user.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (pure tailwind/react) |
| Icon library | lucide-react |
| Font | Arial, Helvetica, sans-serif (system-sans) |

---

## Spacing Scale

Declared values (multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Room cell gap, internal padding |
| sm | 8px | Block labels, legend items |
| md | 16px | Building spacing |
| lg | 24px | Container padding |
| xl | 32px | Layout section gaps |

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | 400 | 1.5 |
| Label (Room Num) | 10px | 700 | 1.0 |
| Heading | 18px | 800 | 1.2 |
| Legend | 12px | 500 | 1.2 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #f8fafc | Page background, whiteboard surface |
| Secondary (30%) | #ffffff | Room cells (available), cards |
| Accent (10%) | #facc15 | Occupied status stickers (yellow) |
| Selected | #2563eb | Selection border and navigation path |
| Maintenance | #ef4444 | Red marks / maintenance status |

Accent reserved for: Occupied status markers, selection border, and the navigation path.

---

## Spatial Layout Contract (Reference: dashboard.jpg)

The map must be structured as a **canvas-style layout** (relative positioning) rather than a standard responsive grid to maintain the physical proportions of the buildings.

### 1. Building Groups
- **North Wing (Building 1):** Two horizontal rows at the top (Rooms 10xx).
- **West Wing (Building 2):** Top-left vertical blocks (Rooms 50xx).
- **Central Block (Building 3):** Middle vertical columns (Rooms 30xx).
- **East Wing (Building 4):** Top-right vertical columns (Rooms 20xx).
- **South Wing (Building 5):** Large bottom-center vertical columns (Rooms 40xx).
- **Annex (Building 6):** Bottom-right single column (Rooms 41xx).

### 2. Room Cell Styling
- **Shape:** Rectangular (Aspect ratio approx 2:1).
- **Border:** 1px solid #e2e8f0 (slate-200).
- **Background:** White (Available) or Yellow-400 (Occupied).
- **Text:** Centered room number in black.

### 3. Navigation Layer
- **Start Point:** Bottom center of the map (Entrance).
- **Path Logic:** When a room is clicked, an SVG `<path>` must be drawn from the Start Point to the target room, following the "streets" between building blocks.
- **Path Style:** Blue dashed line (#2563eb) with marching ants animation.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | Select Room |
| Empty state heading | No Map Data |
| Empty state body | Room data is currently being fetched or is unavailable. |
| Error state | Unable to load map layout. Please check connection. |
| Navigation Text | "Start from Entrance -> Follow path to Room {room_number}" |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PENDING
- [ ] Dimension 2 Visuals: PENDING
- [ ] Dimension 3 Color: PENDING
- [ ] Dimension 4 Typography: PENDING
- [ ] Dimension 5 Spacing: PENDING
- [ ] Dimension 6 Registry Safety: PENDING

**Approval:** pending
