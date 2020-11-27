import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { MicrositeService } from './../microsite.service';
import { SelectAllItems } from './../store/microsite.actions';

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
  styleUrls: ['./downloader.component.scss'],
})
export class DownloaderComponent implements OnInit {
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  downloadChecked = false;

  constructor(
    private store: Store,
    private micrositeService: MicrositeService
  ) {}

  ngOnInit(): void {}

  public checkAllItems(e: any) {
    this.store.dispatch(new SelectAllItems(e.target.checked));
  }

  public async download() {
    // await this.micrositeService.downloadZipFile();
  }

  public downloadAllZip() {}
}
