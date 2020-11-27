export type SiteType = 'CLIENT_SITE' | 'REEL';
export type EntityType = 'ASSET' | 'COLLECTION';
export type Breadcrumb = {
  name: string;
  id: string;
  url: string;
};

export const EntityTypeEnum = {
  ASSET: 1,
  COLLECTION: 2,
};

export const COLLECTION_MICROSITE_ID = 'collection-microsite';

export interface MDVFields {
  [name: string]: string;
}

export type CustomMDFsValueType = { label: string; value: any };

export interface CustomMDFs {
  [name: string]: CustomMDFsValueType;
}

export interface IMedia {
  id: string;
  title: string;
  src: string;
  thumbnail: string;
  type: MediaTypes;
  size: number;
  metadataDic: CustomMDFs;
  metadataList: CustomMDFsValueType[];
  metadataAsText: string;
}

export interface MediaTypes {
  mimeType: string;
  fileExtention: FILE_TYPE;
}

export const MIME_TYPES = {
  mp4: 'video/mp4',
  png: 'application/png',
  mp3: 'audio/mp3',
};

export enum FILE_TYPE {
  mp4 = 1,
  png = 2,
  mp3 = 3,
}

export interface Asset {
  id: string;
  title: string;
  metadata: CustomMDFs; // Can be any fields that a user chooses
  orderNumber?: number; // Only for REEL CollectionMicrosite type
  proxyURL?: string; // Should be requested in addition to the main model
  sourceURL?: string; // Should be requested in addition to the main model
  keyframeURL?: string; // Should be requested in addition to the main model
  size: number;
}
export interface Collection {
  id: string;
  title: string;
  metadata: CustomMDFs;
  collections?: Collection[];
  assets?: Asset[];
}

export interface AssetURLs {
  assetId: string | undefined;
  proxyURL: string | undefined;
  sourceURL: string | undefined;
  keyframeURL: string | undefined;
}

export interface CollectionMicrosite {
  URL: string; // primary key
  dateCreated: string;
  entityType: EntityType;
  type: SiteType;
  reelName?: string; // Only for REEL type
  structure: Asset | Collection; // Depends on Entity type
}
