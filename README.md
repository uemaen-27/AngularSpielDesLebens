# AngularSpielDesLebens

Conway's Game of Life implemented in Angular 20 with Signals, Computed values, and Effects.

## Features

- **Responsive Grid**: Automatically adjusts to container size using ResizeObserver
- **Infinite Wrapping**: Torus topology - cells on edges wrap around to opposite sides
- **Dynamic Sizing**: Calculates grid dimensions based on available space
- **Modern Angular**: Built with Angular Signals, standalone components, and control flow syntax

## Technical Details

| Property | Value |
|----------|-------|
| Cell Size | 15px |
| Minimum Grid | 30×30 |
| Wrapping | Modulo-based (torus topology) |

## Grid Sizing Logic

```
cols = max(MIN_COLS, floor(containerWidth / CELL_SIZE))
rows = max(MIN_ROWS, floor(containerHeight / CELL_SIZE))
```

The grid uses a `ResizeObserver` on the container to detect size changes and automatically recalculate dimensions while preserving existing cell states.

## Development server

```bash
npm start
```

Navigate to `http://localhost:3000/`. The application will automatically reload when source files are modified.

## Building

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.
