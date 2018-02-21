import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.component.html'
})
export class SelectProductsComponent implements OnInit {

  private _labeler_id: string;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() set labeler_id(value: string) {
    this._labeler_id = value;
  }
  get labeler_id(): string {
      return this._labeler_id;
  }

  @Input('productName') productName: string;
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  dataServiceProduct: any;
  
  constructor(
      private completerService: CompleterService,
      @Inject('API_URL') private apiUrl: string) 
  {
      this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.setCompleterService();
  }

  setCompleterService(labeler_id:string=null){
    let lebelerID = labeler_id ? labeler_id : this._labeler_id;
    const productApiUrl = `${this.apiUrl}/products/labeler?token=${this.token}&labeler_id=${lebelerID}&query=`;
    this.dataServiceProduct = this.completerService.remote(productApiUrl, 'fullname', 'fullname');
  }

  setSelectedProduct(event) {
    try {
      this.productName = `${event.originalObject.product_name} (${event.originalObject.generic_name})`
      this.onSelect.emit(event.originalObject);
    } catch (error) {
      //
    }
  }

  clearProductSearch() {
    this.productName = null;
  }
}
