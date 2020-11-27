import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  Breadcrumb,
  Collection, CollectionMicrosite
} from './models/microsite.model';
import { SetBreadcrumbs } from './store/microsite.actions';
import { MicrositeState } from './store/microsite.state';

@Injectable()
export class BreadcrumbsService {
  folderNestedTrace: any[] = [];

  constructor(private store: Store) {}

  public setBreadcrumbs(finalBreadcrumb?: Breadcrumb) {
    const rootPath = this.store.selectSnapshot(MicrositeState.getRootPath);
    const nestingBreadcrumbs = this.folderNestedTrace.map(
      (collection: Collection, idx: number) => {
        return {
          id: collection.id,
          name: collection.title,
          url:
            idx !== 0
              ? `${rootPath}/folder/${collection.id}`
              : rootPath,
        };
      }
    );
    if (finalBreadcrumb) {
      nestingBreadcrumbs.push(finalBreadcrumb);
    }
    setTimeout(() => {
      this.store.dispatch(new SetBreadcrumbs(nestingBreadcrumbs));
    }, 1);
  }

  public getCollectionById(id: string, micrositeCollection: CollectionMicrosite): Collection {
    if (micrositeCollection.entityType === 'COLLECTION') {
      this.folderNestedTrace = [];
      const collection = this.lookupCollection(
        id,
        micrositeCollection.structure
      );
      return collection;
    }
  }

  private lookupCollection(id: string, collection: Collection): Collection {
    this.folderNestedTrace.push(collection);
    if (collection.id === id) {
      return collection;
    }
    if (!collection?.collections.length) {
      return;
    }
    for (const nestedCollection of collection.collections) {
      const res = this.lookupCollection(id, nestedCollection);
      if (!!res) {
        return res;
      }
    }
    this.folderNestedTrace.pop();
  }

}
