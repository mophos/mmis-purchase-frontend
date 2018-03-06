import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductVendorComponent } from './search-product-vendor/search-product-vendor.component';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { SearchVendorComponent } from './search-vendor/search-vendor.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AgxTypeaheadModule,
    FormsModule
  ],
  declarations: [SearchProductVendorComponent, SearchVendorComponent],
  exports: [SearchProductVendorComponent, SearchVendorComponent]
})
export class AutocompleteModule { }
