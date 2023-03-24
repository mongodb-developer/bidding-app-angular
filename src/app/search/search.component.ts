import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Auction } from '../auction';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  itemOptions: Observable<Auction[]>;

  searchForm = this.fb.group({
    query: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private router: Router
  ) {

    this.itemOptions = this.search(this.searchForm.controls.query);
  }

  itemSelected(event: any) {
    const item = event.option.value;
    if (!item || !item._id) {
      return;
    }

    this.router.navigate([`/auctions/${item._id}`]);

    this.searchForm.patchValue({
      ...event.option.value,
    }, { emitEvent: false });
  }

  displayName(item: any) {
    return item.name;
  }

  private search(formControl: FormControl<any>) {
    return formControl.valueChanges.pipe(
      filter(text => text!.length > 1),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(searchTerm => this.auctionService.search(searchTerm!)),
    );
  }

}
