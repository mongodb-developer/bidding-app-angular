import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import * as Realm from 'realm-web';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuctionCatalogueComponent } from './auction-catalogue/auction-catalogue.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';

function initializeApp(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const app = new Realm.App({ id: 'bidding-ormmh' });
      const credentials = Realm.Credentials.anonymous();
      await app.logIn(credentials);

      return resolve(app);
    } catch(err) {
      console.error(err);
      return reject(err);
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    AuctionCatalogueComponent,
    AuctionDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: () => initializeApp,
    multi: true
   }],
  bootstrap: [AppComponent]
})
export class AppModule { }
