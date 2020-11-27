import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Breadcrumb, CollectionMicrosite } from './models/microsite.model';
import {
  RemoveBreadcrumb,
  SelectAllItems,
  SetMicrositeAssets,
  SetMicrositeCollection,
  SetRootPath,
  SetSelectionMode,
} from './store/microsite.actions';
import { MicrositeState } from './store/microsite.state';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isGridMode = true;
  isDownloaderOpen = false;
  isLoaded = false;

  @Select(MicrositeState.isLoaded)
  isMicrositeLoaded$: Observable<boolean>;

  @Select(MicrositeState.getBreadcrumbs)
  breadcrumbs$: Observable<Breadcrumb[]>;

  @Select(MicrositeState.getMicrositeCollection)
  micrositeCollection$: Observable<CollectionMicrosite>;

  constructor(
    private store: Store,
    private router: Router,
    private location: Location,
    private errorService: ErrorService
  ) {
  }

  async ngOnInit(): Promise<void> {
    let currentPath = this.location.path();
    const rootPath = this.getRootPath(currentPath);

    if (!rootPath) {
      this.errorService.showToast('Incorrect path');
      return;
    }

    this.store.dispatch(new SetRootPath(rootPath));
    if (!this.store.selectSnapshot(MicrositeState.setMicrositeCollection)) {
      this.store
        .dispatch(new SetMicrositeCollection(rootPath))
        .subscribe((val) => {
          if (val) {
            const { micrositeCollection } = val.microsite;
            console.log(micrositeCollection)
            if (
              (micrositeCollection.entityType !== 'COLLECTION' &&
                micrositeCollection.type === 'REEL') ||
              micrositeCollection.entityType === 'ASSET'
            ) {
              this.store.dispatch(
                new SetMicrositeAssets([micrositeCollection.structure])
              );
              this.router.navigate([
                rootPath,
                'player',
                'asset',
                micrositeCollection.structure.id,
              ]);
            }
            if (
              micrositeCollection.entityType === 'COLLECTION' &&
              micrositeCollection.type === 'REEL'
            ) {
              this.store.dispatch(
                new SetMicrositeAssets(micrositeCollection.structure.assets)
              );
              this.router.navigate([
                rootPath,
                'player',
                'asset',
                micrositeCollection.structure.assets[0].id,
              ]);
            }
            this.isLoaded = true;
          }
        });
    }
  }

  private getRootPath(path: string): string {
    const rootPath = path.split('/')[1];
    return this.isRootPath(rootPath) ? rootPath : undefined;
  }

  private isRootPath(path: string): boolean {
    const regexp = /^\w{9}$/;
    return regexp.test(path);
  }

  public onBreadcrumbsHandler(breadcrumb: Breadcrumb, inactive = false) {
    if (inactive) {
      return;
    }
    this.store.dispatch(new RemoveBreadcrumb(breadcrumb));
    this.router.navigate([breadcrumb.url]);
  }

  public onDownload() {
    this.isDownloaderOpen = !this.isDownloaderOpen;
    if (!this.isDownloaderOpen) {
      this.store.dispatch(new SelectAllItems(false));
    }
    this.store.dispatch(new SetSelectionMode(this.isDownloaderOpen));
  }
}
