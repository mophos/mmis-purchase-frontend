import { BrowserModule,  } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginModule } from './login/login.module';
import { PurchaseModule } from './purchase/purchase.module';
import { AuthGuard } from './auth-guard.service';
import { AlertService } from './alert.service';
import { UsersService } from './users.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import '@clr/icons';
import '@clr/icons/shapes/all-shapes';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
// import { GridReorderPointProductsComponent } from './directives/grid-reorder-point-products/grid-reorder-point-products.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    // GridReorderPointProductsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    BrowserAnimationsModule,
    LoginModule,
    PurchaseModule,
    AppRoutingModule,
    AgxTypeaheadModule,
  ],
  providers: [
    AuthGuard,
    AlertService,
    UsersService,
    { provide: 'LOGIN_URL', useValue: environment.loginUrl },
    { provide: 'HOME_URL', useValue: environment.homeUrl },
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'DOC_URL', useValue: environment.docUrl },
    { provide: 'PO_PREFIX', useValue: environment.purchasingPoPrefix },
    { provide: 'PR_PREFIX', useValue: environment.purchasingPrPrefix },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
