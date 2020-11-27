import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MicrositeService } from '../microsite.service';
import {
  Asset,
  Breadcrumb,
  CollectionMicrosite,
} from './../models/microsite.model';
import {
  AddBreadcrumb,
  RemoveBreadcrumb,
  SelectAllItems,
  SetBreadcrumbs,
  SetCollectionSize,
  SetGridMode,
  SetMicrositeAssets,
  SetMicrositeCollection,
  SetPage,
  SetRootPath,
  SetSelectionMode,
} from './microsite.actions';

export class MicrositeStateModel {
  micrositeCollection: CollectionMicrosite;
  currentAssets: Asset[];
  isLoaded: boolean;
  isGridMode: boolean;
  breadcrumbs: Breadcrumb[];
  rootPath: string;
  page: PageEvent;
  currentCollectionSize: number;
  selectedAllItems: boolean;
  isSelectionMode: boolean;
}

@State<MicrositeStateModel>({
  name: 'microsite',
  defaults: {
    micrositeCollection: null,
    currentAssets: [],
    isLoaded: false,
    isGridMode: true,
    breadcrumbs: [],
    rootPath: '',
    page: null,
    currentCollectionSize: 0,
    selectedAllItems: false,
    isSelectionMode: false,
  },
})
@Injectable()
export class MicrositeState {
  constructor(private micrositeService: MicrositeService) {}

  @Selector()
  static getMicrositeCollection(state: MicrositeStateModel) {
    return state.micrositeCollection;
  }

  @Selector()
  static setMicrositeCollection(state: MicrositeStateModel) {
    return state.micrositeCollection;
  }

  @Selector()
  static getCurrentAssets(state: MicrositeStateModel) {
    return state.currentAssets;
  }

  @Selector()
  static isLoaded(state: MicrositeStateModel) {
    return state.isLoaded;
  }

  @Selector()
  static isGridMode(state: MicrositeStateModel) {
    return state.isGridMode;
  }

  @Selector()
  static getBreadcrumbs(state: MicrositeStateModel) {
    return state.breadcrumbs;
  }

  @Selector()
  static getRootPath(state: MicrositeStateModel) {
    return state.rootPath;
  }

  @Selector()
  static getPage(state: MicrositeStateModel) {
    return state.page;
  }

  @Selector()
  static getCurrentCollectionSize(state: MicrositeStateModel) {
    return state.currentCollectionSize;
  }

  @Selector()
  static isSelectedAllItems(state: MicrositeStateModel) {
    return state.selectedAllItems;
  }

  @Selector()
  static isSelectionMode(state: MicrositeStateModel) {
    return state.isSelectionMode;
  }

  @Action(SetMicrositeCollection)
  async setMicrositeCollection(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { id }: SetMicrositeCollection
  ) {
    const micrositeCollection = await this.micrositeService.setMicrositeCollection(
      id
    );
    const state = getState();
    setState({ ...state, micrositeCollection, isLoaded: true });
  }

  // @Action(GetMicrositeAssetSources)
  // async getMicrositeAssetSources(
  //   { getState, setState }: StateContext<MicrositeStateModel>,
  //   { assetId }: GetMicrositeAssetSources
  // ) {
  //   const state = getState();
  //   let assetSources = state.micrositeAssetSources.find(
  //     (assetSources) => assetSources.assetId === assetId
  //   );
  //   if (!assetSources) {
  //     assetSources = await this.micrositeService.getAssetSourcesUrls(
  //       assetId
  //     );
  //   }
  //   setState({ ...state, micrositeAssetSources: assetSources, isLoaded: true });
  // }

  @Action(SetMicrositeAssets)
  setCurrentAssets(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { assets }: SetMicrositeAssets
  ) {
    const state = getState();
    setState({ ...state, currentAssets: assets });
  }

  @Action(SetGridMode)
  setGridMode(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { value }: SetGridMode
  ) {
    const state = getState();
    setState({ ...state, isGridMode: value });
  }

  @Action(SetBreadcrumbs)
  setBreadcrumbs(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { breadcrumbs }: SetBreadcrumbs
  ) {
    const state = getState();
    setState({ ...state, breadcrumbs });
  }

  @Action(AddBreadcrumb)
  addBreadcrumb(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { breadcrumb }: AddBreadcrumb
  ) {
    const state = getState();
    setState({ ...state, breadcrumbs: [...state.breadcrumbs, breadcrumb] });
  }

  @Action(RemoveBreadcrumb)
  RemoveBreadcrumb(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { breadcrumb }: RemoveBreadcrumb
  ) {
    const state = getState();
    const targetIdx = state.breadcrumbs.indexOf(breadcrumb);
    const truncatedArr = state.breadcrumbs.slice(0, targetIdx);
    setState({ ...state, breadcrumbs: [...truncatedArr] });
  }

  @Action(SetRootPath)
  setRootUrl(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { rootPath }: SetRootPath
  ) {
    const state = getState();
    setState({ ...state, rootPath });
  }

  @Action(SetPage)
  setPage(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { page }: SetPage
  ) {
    const state = getState();
    setState({ ...state, page });
  }

  @Action(SetCollectionSize)
  setCollectionSize(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { size }: SetCollectionSize
  ) {
    const state = getState();
    setState({ ...state, currentCollectionSize: size });
  }

  @Action(SelectAllItems)
  selectAllItems(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { checked }: SelectAllItems
  ) {
    const state = getState();
    setState({ ...state, selectedAllItems: checked });
  }

  @Action(SetSelectionMode)
  setSelectionMode(
    { getState, setState }: StateContext<MicrositeStateModel>,
    { value }: SetSelectionMode
  ) {
    const state = getState();
    setState({ ...state, isSelectionMode: value });
  }
}
