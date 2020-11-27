import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from './app.component';
import { AssetCardComponent } from './asset-card/asset-card.component';
import { BreadcrumbsService } from './breadcrumbs.service';
import { CollectionCardComponent } from './collection-card/collection-card.component';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { DownloaderComponent } from './downloader/downloader.component';
import { ExtraMenuComponent } from './extra-menu/extra-menu.component';
import { MainComponent } from './main/main.component';
import { MicrositeService } from './microsite.service';
import { PaginatorComponent } from './paginator/paginator.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { PlayerService } from './player.service';
import { PlayerComponent } from './player/player.component';
import { MicrositeState } from './store/microsite.state';
import { StructureCardComponent } from './structure-card/structure-card.component';
import { StructureComponent } from './structure/structure.component';
import { ErrorService } from './error.service';

const appRoutes: Routes = [
  {
    path: ':rootId/player/folder/:folderId/asset/:assetId',
    component: PlayerPageComponent,
  },
  {
    path: ':rootId/player/asset/:assetId',
    component: PlayerPageComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: ':rootId', component: StructureComponent, pathMatch: 'full' },
      {
        path: ':rootId/folder/:folderId',
        component: StructureComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    component: MainComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    StructureComponent,
    CollectionCardComponent,
    AssetCardComponent,
    StructureCardComponent,
    ExtraMenuComponent,
    PaginatorComponent,
    DownloaderComponent,
    PlayerPageComponent,
    PlayerComponent,
    PlayerDialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    NgxsModule.forRoot([MicrositeState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MicrositeService, PlayerService, BreadcrumbsService, ErrorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
