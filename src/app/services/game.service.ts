import { Injectable, signal, computed, HostListener } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly cellSize = signal<number>(20);

  readonly rows = signal<number>(0);
  readonly cols = signal<number>(0);

  readonly speed = signal<number>(200);

  grid = signal<number[][]>([]);

  activeCells = computed(() =>
    this.grid().flat().reduce((acc, curr) => acc + curr, 0)
  );

  constructor() {
    this.updateDimensions();
    window.addEventListener('resize', () => this.updateDimensions());
  }

  updateDimensions() {
    const size = this.cellSize();
    const gap = 1;

    const availableWidth = window.innerWidth - 40;
    const availableHeight = window.innerHeight - 200;

    const newCols = Math.floor(availableWidth / (size + gap));
    const newRows = Math.floor(availableHeight / (size + gap));

    if (newCols < 1 || newRows < 1) return;
    if (newCols === this.cols() && newRows === this.rows()) return;

    const oldGrid = this.grid();
    const newGrid = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => {
        return oldGrid[r]?.[c] ?? 0;
      })
    );

    this.cols.set(newCols);
    this.rows.set(newRows);
    this.grid.set(newGrid);
  }

  private createEmptyGrid(r: number, c: number): number[][] {
    if (r <= 0 || c <= 0) return [];

    return Array.from({ length: r }, () =>
      Array.from({ length: c }, () => 0)
    );
  }

  reset() {
    const emptyGrid = Array.from({ length: this.rows() }, () =>
      Array.from({ length: this.cols() }, () => 0)
    );
    this.grid.set(emptyGrid);
  }

  randomize() {
    this.grid.update(oldGrid =>
      oldGrid.map(row => row.map(() => (Math.random() > 0.7 ? 1 : 0)))
    );
  }

  toggleCell(r: number, c: number) {
    this.grid.update(oldGrid => {

      if (!oldGrid[r]) return oldGrid;
      const newGrid = oldGrid.map(row => [...row]);
      newGrid[r][c] = newGrid[r][c] ? 0 : 1;
      return newGrid;
    });
  }

  nextGeneration() {
    const rCount = this.rows();
    const cCount = this.cols();

    this.grid.update(currentGrid => {
      return currentGrid.map((row, r) =>
        row.map((cell, c) => {
          const neighbors = this.countNeighbors(currentGrid, r, c, rCount, cCount);
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );
    });
  }

  private countNeighbors(grid: number[][], r: number, c: number, maxR: number, maxC: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const x = (r + i + maxR) % maxR;
        const y = (c + j + maxC) % maxC;
        count += grid[x][y];
      }
    }
    return count;
  }

  changeZoom(newSize: number) {
    this.cellSize.set(newSize);
    this.updateDimensions();
  }

  setSpeed(newSpeed: number) {
    this.speed.set(newSpeed);
  }
}
