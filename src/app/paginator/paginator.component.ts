import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetPage } from '../store/microsite.actions';
import { MicrositeState } from '../store/microsite.state';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  pageSizeOptions: number[] = [20, 30];

  @Select(MicrositeState.getCurrentCollectionSize)
  currentCollectionSize$: Observable<number>;

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  public paginate(event: PageEvent) {
    this.store.dispatch(new SetPage(event));
  }

}
