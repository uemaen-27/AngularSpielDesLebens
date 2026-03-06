import { Component, signal, effect, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game-grid',
  standalone: true,
  template: `
    <div class="controls">
      <button (click)="isPlaying.set(!isPlaying())">
        {{ isPlaying() ? 'Pause' : 'Start' }}
      </button>
      <button (click)="game.randomize()">Random</button>
      <span>Generationen: {{ generation() }}</span>
      <span>Lebende Zellen: {{ game.activeCells() }}</span>
    </div>

    <div class="grid" [style.gridTemplateColumns]="'repeat(' + game.cols + ', 20px)'">
      @for (row of game.grid(); track r; let r = $index) {
        @for (cell of row; track c; let c = $index) {
          <div 
            class="cell" 
            [class.alive]="cell === 1"
            (click)="game.toggleCell(r, c)">
          </div>
        }
      }
    </div>
  `,
  styles: `
    .grid { display: grid; gap: 1px; background: #333; border: 2px solid #333; }
    .cell { width: 20px; height: 20px; background: #1a1a1a; cursor: pointer; }
    .cell.alive { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
    .controls { margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center; }
  `
})
export class GameGridComponent {
  game = inject(GameService);

  isPlaying = signal(false);
  generation = signal(0);
  speed = signal(200);

  constructor() {
    effect((onCleanup) => {
      if (this.isPlaying()) {
        const interval = setInterval(() => {
          this.game.nextGeneration();
          this.generation.update(g => g + 1);
        }, this.speed());

        onCleanup(() => clearInterval(interval));
      }
    });
  }
}
