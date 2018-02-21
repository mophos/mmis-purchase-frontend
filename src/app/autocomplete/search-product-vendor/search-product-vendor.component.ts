import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-product-vendor',
  templateUrl: './search-product-vendor.component.html',
  styles: []
})
export class SearchProductVendorComponent implements OnInit {

  private _labelerId: string;

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() labelerId;
  set setLabelerId(value: string) {
    this._labelerId = value;
    this.setApiUrl(value);
  }
  _disabled: boolean = false;
  
    @Input('disabled')
    set setDisabled(value: boolean) {
      this._disabled = value;
    }  

  token: any;
  query: any = null;
  searchProductUrl: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchProductUrl = `${this.apiUrl}/products/search/autocomplete-labeler?token=${this.token}&labelerId=${this._labelerId}`;
  }

  setApiUrl(labelerId: any) {
    this.labelerId = labelerId;
    this.searchProductUrl = `${this.apiUrl}/products/search/autocomplete-labeler?token=${this.token}&labelerId=${this.labelerId}`;
  }

  ngOnInit() {
  }

  clearProductSearch() {
    this.query = null;
  }

  clearSelected(event: any) {
    if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.onChange.emit(false);
    } else {
      this.onChange.emit(true);
    }
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = `${event.product_name} (${event.generic_name})`;
  }


}
