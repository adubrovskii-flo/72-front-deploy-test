import { SiteType, CollectionMicrosite } from './../models/microsite.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { BreadcrumbsService } from '../breadcrumbs.service';
import { FILE_TYPE, IMedia } from '../models/microsite.model';
import { PlayerService } from '../player.service';
import { MicrositeService } from './../microsite.service';
import { MicrositeState } from './../store/microsite.state';

@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerPageComponent implements OnInit {
  currentIndex = 0;
  playlistDetailsCurrentIdx = 0;
  FILE_TYPE = FILE_TYPE;
  isMediaInfoOpen = true;
  micrositeCollection: CollectionMicrosite;
  isPlaylistDetailsDisplay = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    public playerService: PlayerService,
    private breadcrumbsService: BreadcrumbsService,
    private micrositeService: MicrositeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(async ({ rootId, folderId, assetId }) => {
      console.log('REEL PAGE');
      console.log(assetId);
      const micrositeCollection = this.store.selectSnapshot(
        MicrositeState.getMicrositeCollection
      );
      this.micrositeCollection = micrositeCollection;
      let currentAsset: any;
      let assets: any;
      if (folderId) {
        assets = this.breadcrumbsService.getCollectionById(
          folderId,
          micrositeCollection
        ).assets;
        currentAsset = assets.find((asset) => asset.id === assetId);
      } else {
        assets = this.store.selectSnapshot(MicrositeState.getCurrentAssets);
        currentAsset = assets.find((asset) => asset.id === assetId);
      }

      if (micrositeCollection.type !== 'REEL') {
        this.breadcrumbsService.setBreadcrumbs({
          id: assetId,
          name: currentAsset.title,
          url: 'dock',
        });
      }
      const updatedAssets = await this.micrositeService.updateAssetsSources(
        assets
      );
      console.log(updatedAssets);
      await this.playerService.init(updatedAssets, assetId);
    });
  }

  onClickPlaylistItem(item: IMedia, index: number) {
    this.currentIndex = index;
    this.playerService.currentItem$.next(item);
  }

  public onClickPlaylistDetails() {
    this.isPlaylistDetailsDisplay = !this.isPlaylistDetailsDisplay;
  }

  public previousPlaylistDetailsItem() {
    if (this.playlistDetailsCurrentIdx > 0) {
      this.playlistDetailsCurrentIdx --;
    }
  }
  
  public nextPlaylistDetailsItem() {
    const playlistLength = this.playerService.playlist$.value.length;
    if (this.playlistDetailsCurrentIdx < playlistLength - 1) {
      this.playlistDetailsCurrentIdx ++;
    }
  }

}
