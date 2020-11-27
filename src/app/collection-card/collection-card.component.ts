import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Collection } from '../models/microsite.model';
import { MicrositeState } from '../store/microsite.state';
import { StructureItem } from '../structure-item';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss'],
})
export class CollectionCardComponent extends StructureItem implements OnInit {
  @Input() data: Collection;
  @Input() idx: number;

  constructor(private router: Router, private store: Store) {
    super();
  }

  ngOnInit(): void {}

  open(id: string) {
    const rootPath = this.store.selectSnapshot(MicrositeState.getRootPath)
    this.router.navigate([rootPath, 'folder', id]);
  }

  download(id: string): void {
    throw new Error('Method not implemented.');
  }
}
