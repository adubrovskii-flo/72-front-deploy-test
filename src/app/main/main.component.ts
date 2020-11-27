import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetGridMode } from '../store/microsite.actions';
import { MicrositeState } from '../store/microsite.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isGridMode = true;
  isGridSettingsOpened = false;

  gridSettingsForm: FormGroup;

  constructor(private store: Store, private fb: FormBuilder) {
    this.gridSettingsForm = this.fb.group({ gridMode: true });
    this.isGridMode = this.store.selectSnapshot(MicrositeState.isGridMode);
  }

  ngOnInit() {
    this.gridSettingsForm.get('gridMode').valueChanges.subscribe((val) => {
      this.changeGridMode(val);
    });
  }

  public showGridSettings() {
    this.isGridSettingsOpened = !this.isGridSettingsOpened;
  }

  changeGridMode(isGridSelected) {
    this.isGridMode = isGridSelected;
    this.store.dispatch(new SetGridMode(this.isGridMode));
  }
}
