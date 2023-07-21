import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit {
  @Input() endDate = new Date();
  seconds = 0; 
  timeRemaining$: Observable<number> = new Observable();

  ngOnInit() {
    const end = new Date(this.endDate).getTime();
    const now = new Date().getTime();

    const diff = end - now;
    this.seconds = Math.floor(diff / 1000);

    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => this.seconds - n),
      takeWhile(n => n >= 0),
    );
  }

}
