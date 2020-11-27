import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Asset } from '../models/microsite.model';
import { PlayerDialogComponent } from '../player-dialog/player-dialog.component';
import { PlayerService } from '../player.service';
import { StructureItem } from '../structure-item';
import { MicrositeService } from './../microsite.service';
import { MicrositeState } from './../store/microsite.state';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss'],
})
export class AssetCardComponent extends StructureItem implements OnInit {
  @Input() data: Asset;
  @Input() idx: number;
  folderId: string;

  constructor(
    private micrositeService: MicrositeService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public store: Store,
    private playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(({ folderId }) => {
      if (folderId) {
        this.folderId = folderId;
      }
    });
  }

  open(assetId: string) {
    const rootPath = this.store.selectSnapshot(MicrositeState.getRootPath);
    if (!this.folderId) {
      this.router.navigate([rootPath, 'player', 'asset', assetId]);
      return;
    }
    this.router.navigate([rootPath, 'player', 'folder', this.folderId, 'asset', assetId]);
  }

  public async openQuickviewDialog() {
    let currentAssets = this.store.selectSnapshot(
      MicrositeState.getCurrentAssets
    );
    await this.playerService.init(currentAssets, this.data.id);
    this.dialog.open(PlayerDialogComponent, {
      height: '580px',
      width: '1000px',
    });
  }

  public async download() {
    const links = await this.micrositeService.getAssetSourcesUrls(this.data.id);
    const filename = this.micrositeService.getFilenameFromUrl(links.sourceURL);
    this.micrositeService.getAssetContentByUrl(links.sourceURL, filename);
    console.log('********************* DOWNLOAD RESULT ********************');
    // console.log(res)
    // await this.micrositeService.downloadZipFile(res, filename);
  }
}
