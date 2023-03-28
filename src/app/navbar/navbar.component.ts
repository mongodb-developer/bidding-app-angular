import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Auction } from '../auction';
import { AuctionService } from '../auction.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username = '';
  @ViewChild('searchbar') searchBar: ElementRef;

  toggleSearch: boolean = false;
  itemOptions: Observable<Auction[]>;

  searchForm = this.fb.group({
    query: ['', Validators.required],
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private router: Router
  ) {

    this.itemOptions = this.search(this.searchForm.controls.query);
  }

  ngOnInit(): void {
    this.username = this.userService.username;    
  }


  openSearch() {
    this.toggleSearch = true;
    this.searchBar.nativeElement.focus();
  }
  searchClose() {
    this.searchForm.patchValue({
      query: ''
    }, { emitEvent: false });
    this.toggleSearch = false;
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