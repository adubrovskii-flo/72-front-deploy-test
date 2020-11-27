import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { MicrositeState } from '../store/microsite.state';
import { SetGridMode } from './../store/microsite.actions';

@Component({
  selector: 'app-extra-menu',
  templateUrl: './extra-menu.component.html',
  styleUrls: ['./extra-menu.component.scss']
})
export class ExtraMenuComponent {
  public isGridMode = true;
  
  constructor(private store: Store) {
    this.isGridMode = this.store.selectSnapshot(MicrositeState.isGridMode);
  }

  changeGridMode() {
    this.isGridMode = !this.isGridMode;
    this.store.dispatch(new SetGridMode(this.isGridMode));
  }
}
