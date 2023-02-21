import * as Realm from 'realm-web';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RealmAppService {
  private static app: Realm.App;

  constructor() { }

  async getAppInstance() { 
    if (RealmAppService.app) {
      return RealmAppService.app;
    } else {
      RealmAppService.app = new Realm.App({ id: 'bidding-ormmh' });
      await this.loginAnonymous(RealmAppService.app);

      return RealmAppService.app;
    }
  }

  private async loginAnonymous(app: Realm.App) {
    // Create an anonymous credential
    const credentials = Realm.Credentials.anonymous();
    try {
      // Authenticate the user
      const user = await app.logIn(credentials);

      // `App.currentUser` updates to match the logged in user
      console.assert(user.id === app?.currentUser?.id);
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to log into the Realm app');
    }
  }
}
