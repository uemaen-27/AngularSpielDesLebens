import { Component, signal, effect, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-grid',
  standalone: true,
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css']
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
