import * as Realm from 'realm-web';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealmAppService {
  private static app: Realm.App;

  async getAppInstance() {
    if (!RealmAppService.app) {
      RealmAppService.app = new Realm.App({ id: environment.APP_ID});

      const credentials = Realm.Credentials.anonymous();
      await RealmAppService.app.logIn(credentials);
    }

    return RealmAppService.app;
  }
}
