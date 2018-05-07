import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductVendorComponent } from './search-product-vendor/search-product-vendor.component';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { SearchVendorComponent } from './search-vendor/search-vendor.component';
import { FormsModule } from '@angular/forms';
import { SearchPeopleComponent } from './search-people/search-people.component';

@NgModule({
  imports: [
    CommonModule,
    AgxTypeaheadModule,
    FormsModule
  ],
  declarations: [SearchProductVendorComponent, SearchVendorComponent, SearchPeopleComponent],
  exports: [SearchProductVendorComponent, SearchVendorComponent, SearchPeopleComponent]
})
export class AutocompleteModule { }
