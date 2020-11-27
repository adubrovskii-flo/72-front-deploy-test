import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AssetCardComponent } from '../asset-card/asset-card.component';
import { BreadcrumbsService } from '../breadcrumbs.service';
import { ErrorService } from '../error.service';
import {
  Asset,
  Breadcrumb,
  Collection,
  EntityType,
  EntityTypeEnum,
} from '../models/microsite.model';
import { MicrositeState } from '../store/microsite.state';
import { CollectionCardComponent } from './../collection-card/collection-card.component';
import { MicrositeService } from './../microsite.service';
import { CollectionMicrosite } from './../models/microsite.model';
import {
  SetBreadcrumbs,
  SetCollectionSize,
  SetMicrositeAssets,
} from './../store/microsite.actions';

export const PAGE_SIZE_DEFAULT = 20;

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
})
export class StructureComponent implements OnInit {
  @Input() structureData: Asset | Collection;
  @Input() structureType: EntityType;
  @ViewChild('structureOutlet', { read: ViewContainerRef, static: true })
  private structureOutlet: ViewContainerRef;
  private folderId: string;
  private isMicrositeLoadedSub: Subscription = new Subscription();
  private currentPageSub: Subscription = new Subscription();
  private micrositeCollection: CollectionMicrosite;

  @Select(MicrositeState.getCurrentAssets)
  micrositeCurrentAssets$: Observable<Asset[]>;

  @Select(MicrositeState.isLoaded)
  isMicrositeLoaded$: Observable<boolean>;

  @Select(MicrositeState.isGridMode)
  isGridMode$: Observable<boolean>;

  @Select(MicrositeState.getPage)
  currentPage$: Observable<PageEvent>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private store: Store,
    private breadcrumbsService: BreadcrumbsService,
    private micrositeService: MicrositeService,
    private errorService: ErrorService
  ) {
    this.micrositeCollection = this.store.selectSnapshot(
      MicrositeState.getMicrositeCollection
    );
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.folderId = params['folderId'];
      if (this.folderId) {
        this.structureData = this.breadcrumbsService.getCollectionById(
          this.folderId,
          this.micrositeCollection
        );
        this.breadcrumbsService.setBreadcrumbs();
      } else {
        this.structureData = this.micrositeCollection.structure;
        this.setBreadcrumbs([
          {
            id: this.micrositeCollection.structure.id,
            name: this.micrositeCollection.structure.title,
            url: this.micrositeCollection.structure.id,
          },
        ]);
      }
      this.structureType = this.micrositeCollection.entityType;
      this.createView();
    });

    this.currentPageSub = this.currentPage$.subscribe((page) => {
      if (page) {
        this.createView(page.pageSize, page.pageIndex);
      }
    });
  }

  private setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    setTimeout(() => {
      this.store.dispatch(new SetBreadcrumbs(breadcrumbs));
    }, 1);
  }

  ngOnDestroy() {
    this.isMicrositeLoadedSub.unsubscribe();
    this.currentPageSub.unsubscribe();
  }

  private createView(pageSize = PAGE_SIZE_DEFAULT, pageIndex = 0) {
    const assetCardFactory = this.resolver.resolveComponentFactory(
      AssetCardComponent
    );
    const collectionCardFactory = this.resolver.resolveComponentFactory(
      CollectionCardComponent
    );

    switch (EntityTypeEnum[this.structureType]) {
      case EntityTypeEnum.ASSET:
        const assetCardRef = this.structureOutlet.createComponent(
          assetCardFactory
        );
        assetCardRef.instance.data = this.structureData as Asset;
        break;
      case EntityTypeEnum.COLLECTION:
        this.renderCollectionContent(
          collectionCardFactory,
          assetCardFactory,
          this.structureData,
          pageSize,
          pageIndex
        );
        break;
      default:
        this.errorService.showToast("Can't render component, check data");
    }
  }

  private async renderCollectionContent(
    collectionCardFactory: ComponentFactory<CollectionCardComponent>,
    assetCardFactory: ComponentFactory<AssetCardComponent>,
    collection: Collection,
    pageSize: number,
    pageIndex: number
  ) {
    this.structureData[
      'assets'
    ] = await this.micrositeService.updateAssetsSources(
      this.structureData['assets']
    );
    this.store.dispatch(new SetMicrositeAssets(this.structureData['assets']));

    let startWith = pageIndex * pageSize;
    this.structureOutlet.clear();
    const collectionsLength = collection?.collections?.length || 0;
    const assetsLength = collection?.assets?.length || 0;
    const collections = collection.collections || [];
    const assets = collection.assets || [];
    if (collectionsLength || assetsLength) {
      const mergedItems = [...collections, ...assets];
      this.store.dispatch(new SetCollectionSize(mergedItems.length));
      for (let idx = 0; idx < mergedItems.length && idx < pageSize; idx++) {
        const item = mergedItems[startWith++];
        // check for asset
        if (
          Object.hasOwnProperty.call(item, 'size') ||
          Object.hasOwnProperty.call(item, 'sourceURL')
        ) {
          const assetCardRef = this.structureOutlet.createComponent(
            assetCardFactory
          );
          assetCardRef.instance.data = item as Asset;
          assetCardRef.instance.idx = startWith;
        } else {
          const collectionCardRef = this.structureOutlet.createComponent(
            collectionCardFactory
          );
          collectionCardRef.instance.data = item as Collection;
          collectionCardRef.instance.idx = startWith;
        }
      }
    }
  }
}
