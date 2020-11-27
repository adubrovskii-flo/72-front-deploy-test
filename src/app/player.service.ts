import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ErrorService } from './error.service';
import { MicrositeService } from './microsite.service';
import { Asset, IMedia } from './models/microsite.model';

@Injectable()
export class PlayerService {
  player$ = new BehaviorSubject<ElementRef>(null);
  playlist$ = new BehaviorSubject<Array<IMedia>>([]);
  currentItem$ = new BehaviorSubject<IMedia>(null);
  skipTrack$ = new BehaviorSubject(1);

  constructor(
    private micrositeService: MicrositeService,
    private errorService: ErrorService
  ) {}

  skipTrack() {
    this.skipTrack$.next(4);
  }

  public async init(currentAssets: Asset[], assetId: string): Promise<void> {
    try {
      const playlist = await this.getPlaylist(currentAssets);
      const currentItem = playlist.find((item) => item.id === assetId);
      this.playlist$.next(playlist);
      this.currentItem$.next(currentItem);
      return Promise.resolve();
    } catch (error) {
      this.errorService.showToast("Can't get assets sources", error);
    }
  }

  /**
   * getPlaylist
   */
  public async getPlaylist(currentAssets: Asset[]): Promise<Array<IMedia>> {
    return currentAssets
      .map((asset) => {
        const filename = this.micrositeService.getFilenameFromUrl(
          asset.sourceURL
        );
        const type = this.micrositeService.getTypeByFileName(filename);

        const metadataAsList = this.micrositeService.transformMDFsToArray(
          asset.metadata
        );
        let metadataAsText = '';
        for (const field of metadataAsList) {
          const mdAsText = `${field.label}: ${field.value}\n`;
          metadataAsText += mdAsText;
        }

        return {
          id: asset.id,
          thumbnail: asset.keyframeURL,
          src: asset.sourceURL,
          title: asset.title,
          metadataDic: asset.metadata,
          size: asset.size || 0,
          metadataList: metadataAsList,
          metadataAsText,
          type,
        };
      })
      .filter((item) => !!item);
  }
}
