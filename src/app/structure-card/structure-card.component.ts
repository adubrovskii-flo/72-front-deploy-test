import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MicrositeService } from '../microsite.service';
import { Asset, Collection, EntityType } from './../models/microsite.model';
import { MicrositeState } from './../store/microsite.state';

@Component({
  selector: 'app-structure-card',
  templateUrl: './structure-card.component.html',
  styleUrls: ['./structure-card.component.scss'],
})
export class StructureCardComponent implements OnInit {
  @Input() idx: string;
  @Input() data: Asset | Collection;
  @Input() type: EntityType;
  @Input() thumb: string;
  @Output() onOpenEvent: EventEmitter<string> = new EventEmitter<string>(null);

  @Select(MicrositeState.isSelectedAllItems)
  isSelectedAllItems$: Observable<boolean>;

  @Select(MicrositeState.isSelectionMode)
  isSelectionMode$: Observable<boolean>;

  @Select(MicrositeState.isGridMode)
  isGridMode$: Observable<boolean>;

  constructor(private micrositeService: MicrositeService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onOpen() {
    this.onOpenEvent.emit(this.data.id);
  }

  getMetadataAsList() {
    return this.micrositeService.transformMDFsToArray(this.data.metadata);
  }
}
