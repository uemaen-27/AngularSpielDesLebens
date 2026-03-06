import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly rows = 30;
  readonly cols = 30;

  grid = signal<number[][]>(this.createEmptyGrid());

  activeCells = computed(() =>
    this.grid().flat().reduce((acc, curr) => acc + curr, 0)
  );

  private createEmptyGrid() {
    return Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
  }

  randomize() {
    this.grid.update(oldGrid =>
      oldGrid.map(row => row.map(() => (Math.random() > 0.7 ? 1 : 0)))
    );
  }

  toggleCell(r: number, c: number) {
    this.grid.update(oldGrid => {
      const newGrid = oldGrid.map(row => [...row]);
      newGrid[r][c] = newGrid[r][c] ? 0 : 1;
      return newGrid;
    });
  }

  nextGeneration() {
    this.grid.update(currentGrid => {
      return currentGrid.map((row, r) =>
        row.map((cell, c) => {
          const neighbors = this.countNeighbors(currentGrid, r, c);
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );
    });
  }

  private countNeighbors(grid: number[][], r: number, c: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const x = (r + i + this.rows) % this.rows;
        const y = (c + j + this.cols) % this.cols;
        count += grid[x][y];
      }
    }
    return count;
  }
}
