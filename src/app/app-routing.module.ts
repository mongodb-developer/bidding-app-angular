import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionCatalogueComponent } from './auction-catalogue/auction-catalogue.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auctions', component: AuctionCatalogueComponent },
  { path: 'auctions/:id', component: AuctionDetailsComponent },
  { path: '', redirectTo: 'auctions', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
