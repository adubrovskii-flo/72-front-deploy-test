import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ErrorService } from './error.service';
import {
  Asset,
  AssetURLs,
  CollectionMicrosite,
  CustomMDFs,
  CustomMDFsValueType,
  FILE_TYPE,
  MediaTypes,
  MIME_TYPES,
} from './models/microsite.model';

@Injectable()
export class MicrositeService {
  http: HttpClient;
  apiUrl = 'http://localhost:4000/collection-microsite';
  zip: JSZip;
  folderNestedTrace: any[] = [];

  constructor(http: HttpClient, private errorService: ErrorService) {
    this.http = http;
    this.zip = new JSZip();
  }

  public setMicrositeCollection(id: string): Promise<CollectionMicrosite> {
    return this.http
      .get<CollectionMicrosite>(`${this.apiUrl}/${id}`)
      .toPromise();
  }

  public getAssetSourcesUrls(assetId: string): Promise<AssetURLs> {
    return this.http
      .get<AssetURLs>(`${this.apiUrl}/asset-sources/${assetId}`)
      .toPromise();
  }

  public async updateAssetsSources(assets: Asset[]): Promise<Asset[]> {
    try {
      return Promise.all(
        assets.map(async (asset) => {
          const assetUrls = await this.getAssetSourcesUrls(asset.id);
          return { ...asset, ...assetUrls };
        })
      );
    } catch (error) {
      this.errorService.showToast('Assets not found', error);
    }
  }

  // public getAssetsSourcesUrls(assets: Asset[]): Promise<AssetURLs[]> {
  //   return Promise.all<AssetURLs>(
  //     assets.map(async (asset) => {
  //       const assetSources = await this.getAssetSourcesUrls(
  //         asset.id
  //       );
  //       return {
  //         assetId: asset.id,
  //         ...assetSources,
  //       };
  //     })
  //   );
  // }

  public async downloadZipFile(data: ArrayBuffer, path: string) {
    console.log('******** MAKING ZIP FILE START *****************');
    this.zip.file(path, data, { binary: true });
    console.log('******** GENERATE BLOB *****************');
    const blob = await this.zip.generateAsync({ type: 'blob' });
    console.log('************** GENERATED BLOB ***************');
    console.log(blob);
    // saveAs( new Blob([data], {type: MIME_TYPES.mp4}), 'testfile.mp4')
    saveAs(blob, 'examplo1.zip');
  }

  public async getAssetContentByUrl(url?: string, filename?: string) {
    const targetUrl = url.replace('https://', '');
    const proxy = 'http://cors-anywhere.herokuapp.com';

    // JSZipUtils.getBinaryContent(`${proxy}/${targetUrl}`, function (err, data) {
    //   console.log('asdfsdf')
    //   if (err) {
    //     console.log(err); // or handle the error
    //   }
    //   var zip = new JSZip();
    //   console.log(data);
    //   zip.file('video.mp4', data, { binary: true });
    //   zip.generateAsync({ type: 'blob' }).then(
    //     function (blob) {
    //       saveAs(blob, 'archive.zip');
    //     },
    //     function (err) {
    //       console.log(err);
    //     }
    //   );
    // });

    this.http
      .get(`${proxy}/${targetUrl}`, {
        reportProgress: true,
        observe: 'events',
        responseType: 'arraybuffer',
      })
      .subscribe((data) => {
        if (data.type === 3) {
          // TODO: handle loading progress
        }
        if (data.type === 4) {
          const { mimeType } = this.getTypeByFileName(filename);
          // var file = new File([data['body']], filename, { type: 'application/force-download' });
          // window.open(URL.createObjectURL(file));
          saveAs(new Blob([data['body']], { type: mimeType }), filename);
        }
      });
  }

  public getTypeByFileName(filename: string): MediaTypes {
    if (!filename) {
      return;
    }
    const lastDot = filename.lastIndexOf('.');
    const EXT = filename.substr(lastDot + 1);
    return {
      mimeType: MIME_TYPES[EXT],
      fileExtention: FILE_TYPE[EXT],
    };
  }

  public getFilenameFromUrl(url: string): string {
    try {
      const decodedUrl = decodeURI(url);
      const filename = decodedUrl.match(/filename(%3D|=)"(.+?\..+?)"/)[2];
      return filename;
    } catch (err) {
      console.log("Can't get filename from url");
      return;
    }
  }

  public transformMDFsToArray(
    dictianary: CustomMDFs
  ): Array<CustomMDFsValueType> {
    const resArray = [];
    for (const field in dictianary) {
      if (Object.prototype.hasOwnProperty.call(dictianary, field)) {
        const element = dictianary[field];
        resArray.push(element);
      }
    }
    return resArray;
  }
}
