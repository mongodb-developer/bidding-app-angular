import { Injectable } from '@angular/core';
import { getRandomUsername } from './usernames';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  username: string;
  
  constructor() {
    this.username = getRandomUsername();
  }
}
