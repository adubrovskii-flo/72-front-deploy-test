import { PageEvent } from '@angular/material/paginator';
import { Breadcrumb } from '../models/microsite.model';
import { Asset } from './../models/microsite.model';

export class SetMicrositeCollection {
  static readonly type = '[MicrositeCollection] Set';

  constructor(public id: string) {}
}

export class GetMicrositeAssetSources {
  static readonly type = '[MicrositeAssetSources] Get';

  constructor(public assetId: string) {}
}

export class SetMicrositeAssets {
  static readonly type = '[MicrositeAssets] Set';

  constructor(public assets: Asset[]) {}
}

export class SetGridMode {
  static readonly type = '[MicrositeCollectionGridMode] Set';

  constructor(public value: boolean) {}
}

export class SetBreadcrumbs {
  static readonly type = '[Breadcrumbs] Set';

  constructor(public breadcrumbs: Breadcrumb[]) {}
}

export class AddBreadcrumb {
  static readonly type = '[Breadcrumbs] Add';

  constructor(public breadcrumb: Breadcrumb) {}
}

export class RemoveBreadcrumb {
  static readonly type = '[Breadcrumbs] Remove';

  constructor(public breadcrumb: Breadcrumb) {}
}

export class SetRootPath {
  static readonly type = '[RootPath] Set';

  constructor(public rootPath: string) {}
}

export class SetPage {
  static readonly type = '[Paginate] Set'

  constructor(public page: PageEvent) {}
}

export class SetCollectionSize {
  static readonly type = '[CollectionSize] Set'

  constructor(public size: number) {}
}

export class SelectAllItems {
  static readonly type = '[AllItems] Select'

  constructor(public checked: boolean) {}
}

export class SetSelectionMode {
  static readonly type = '[SelectionMode] Set'

  constructor(public value: boolean) {}
}
