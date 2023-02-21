import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.username = this.userService.username;    
  }
}