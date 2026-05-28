---
phase: 5
slug: editor-tier-dashboard-map
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-20
---

# Phase 5 — UI Design Contract: Award-Tier Map Replication

> This specification provides a perfect blueprint for replicating the physical whiteboard room map shown in `dashboard.jpg`. The implementation must abandon generic grids in favor of a spatial canvas layout.

---

## HARD CONSTRAINTS (Verbatim)

1. **Spatial Fidelity**: Do NOT use standard responsive CSS grids (`grid-cols-n`) for the main map container. Use a **Relative/Absolute Canvas approach** where building "islands" are positioned specifically to mirror the physical whiteboard geometry.
2. **Building Topology**:
    - **Building 1 (North)**: Horizontal strips at the extreme top.
    - **Building 5 (West)**: Four tall vertical columns on the left.
    - **Building 3 & 2 (Central)**: Middle-layer vertical blocks separated by a main central corridor.
    - **Building 4 (South)**: The largest block, occupying the bottom-center/bottom-left, with 11+ vertical columns.
3. **Corridor System**: All building "islands" must be separated by visible "streets" (background color: `#D1D5DB` or `bg-gray-300`).
4. **Color Accuracy**:
    - **Available**: White card, 1px slate-300 border, dark text.
    - **Occupied**: Yellow-400 (`#FACC15`) card, 1px yellow-600 border, dark text (mimics yellow stickers).
5. **Pathfinding Interaction**: Clicking a room must draw a **Dashed Blue SVG Path** starting from the "Entrance" (Bottom-Center) and following the corridors to the selected room.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | Tailwind CSS 4.0 |
| Component Library | None (Custom React components for map) |
| Icon Library | Lucide React |
| Base Font | Geist Sans (Inter fallback) |
| Scale | 4px (8-point grid for spacing) |

---

## Spatial Layout Contract

### 1. The Map Container
- **Background**: `#E5E7EB` (Gray-200) or a subtle "Whiteboard" texture.
- **Dimensions**: Aspect ratio approx 4:3. Must be scrollable on mobile but fully visible on desktop.

### 2. Building Island Specs
Buildings are white "islands" (`bg-white`) with rounded corners (`rounded-lg`) and a subtle drop shadow.

| Building | Rooms Range | Layout Style | Position |
|----------|-------------|--------------|----------|
| **Building 1** | 1001 - 1021 | 2 Horizontal Rows | Top Edge |
| **Building 5** | 5001 - 5072 | 4 Vertical Columns | Far Left |
| **Building 3** | 3001 - 3043 | 6 Vertical Blocks | Middle-Left |
| **Building 2** | 2001 - 2058 | 6 Vertical Blocks | Middle-Right |
| **Building 4** | 4001 - 4108 | 11 Vertical Columns | Bottom-Center |
| **Annex** | 4119 - 4136 | 1 Vertical Strip | Far Bottom-Right |

### 3. Room Cell Detail
- **Size**: Approx 40px width x 20px height (scaled proportionally).
- **Typography**: 10px Bold, Condensed.
- **Hover**: Scale 1.1, Z-index 50.

---

## Color Contract (60/30/10)

| Layer | Color | Usage |
|-------|-------|-------|
| **Dominant (60%)** | `#F3F4F6` | Whiteboard Surface / Corridors |
| **Secondary (30%)** | `#FFFFFF` | Building Islands / Available Rooms |
| **Accent (10%)** | `#FACC15` | Occupied Rooms (Yellow Stickers) |
| **Path** | `#2563EB` | Active Navigation Path (Blue) |

---

## Interaction Contract

### 1. Navigation Logic
- **Entrance Node**: Fixed at bottom-center coordinate `(x: 50%, y: 95%)`.
- **Target Node**: Center coordinate of the clicked room cell.
- **Routing**: The path must move only along the corridors (Manhattan-style routing or predefined waypoint nodes).

### 2. Copywriting
- **Instructions**: "Start from Main Entrance (Bottom) → Walk through the central corridor → Turn {direction} to Wing {wing_id} → Room {id}."
- **Empty State**: "Select a room to begin navigation."

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Room Label | 9px - 10px | 700 (Bold) | 1.0 |
| Wing Label | 12px | 900 (Black) | 1.2 |
| Sidebar Title| 20px | 800 (ExtraBold)| 1.2 |
| Body | 14px | 400 (Regular) | 1.5 |

---

## File Registry Safety

| Registry | Status |
|----------|--------|
| shadcn/ui | No external blocks required. Implementation uses standard React + SVG. |
