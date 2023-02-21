import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuctionCatalogueComponent } from './auction-catalogue/auction-catalogue.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { LoginComponent } from './login/login.component';
import { RealmAppService } from './realm-app.service';
import { UserService } from './user.service';
import { getRandomUsername } from './usernames';
import { NavbarComponent } from './navbar/navbar.component';

function initializeApp(realmAppService: RealmAppService, userService: UserService) {
  return () => new Promise(async (resolve, reject) => {
    try {
      const app = await realmAppService.getAppInstance();
      const username = getRandomUsername();
      userService.username = username;
      console.log(username);

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
    LoginComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    deps: [RealmAppService, UserService],
    useFactory: initializeApp,
    multi: true
   }],
  bootstrap: [AppComponent]
})
export class AppModule { }
