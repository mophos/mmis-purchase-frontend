import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchProductVendorComponent } from './search-product-vendor/search-product-vendor.component';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { FormsModule } from '@angular/forms';
import { SearchVendorComponent } from './search-vendor/search-vendor.component';

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
