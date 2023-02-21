import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionCatalogueComponent } from './auction-catalogue/auction-catalogue.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';

const routes: Routes = [
  { path: 'catalogue', component: AuctionCatalogueComponent },
  { path: 'auction/:id', component: AuctionDetailsComponent },
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
