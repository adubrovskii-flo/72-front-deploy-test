import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { FILE_TYPE, IMedia } from '../models/microsite.model';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  playlist: Array<IMedia> = [];
  @Output() skipIndex: EventEmitter<number> = new EventEmitter<number>();
  currentIndex = 0;
  FILE_TYPE = FILE_TYPE;

  constructor(
    public playerService: PlayerService,
  ) {
  }

  ngOnInit(): void {
    this.playlist = this.playerService.playlist$.value;
  }

  onClickNext() {
    this.currentIndex++;
    this.playerService.currentItem$.next(this.playlist[this.currentIndex]);
  }

  onClickPrevious() {
    this.currentIndex--;
    this.playerService.currentItem$.next(this.playlist[this.currentIndex]);
  }

  playListEnd(index: number): boolean {
    return index + 1 > this.playlist.length - 1 ? true : false;
  }
}
