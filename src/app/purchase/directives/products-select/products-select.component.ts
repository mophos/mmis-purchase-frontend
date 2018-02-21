
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LabelerService } from './../../share/labeler.service';
import { AlertService } from './../../../alert.service';
import { ProductService } from './../../share/product.service';

@Component({
  selector: 'app-products-select',
  templateUrl: './products-select.component.html',
  styleUrls: ['./products-select.component.css']
})
export class ProductsSelectComponent implements OnInit {
  timer: any;
  labelerId: string;
  query: string;
  isSearching: boolean;
  loadingProducts: boolean;
  selectedProductModal: boolean;
  labelerDetail: any = {};
  products: Array<any> = [];
  productsSearche: Array<any> = [];
  productsSelected: Array<any> = [];

  @Input('formOpen') formOpen: boolean;
  @Input('modalSize') modalSize: string = 'xl';
  
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() onOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() onSelectedChange: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() onMultiSelectedChange: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() eventAfterSave: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(
    private productService: ProductService,
    private labelerService: LabelerService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
  ) { }

  ngOnInit() {

  }

  open(labelerId: string, query: string=''){
    this.formOpen = true;
    this.query = query;
    this.labelerId = labelerId;
    
    this.getLabelerDetail(labelerId);
    if(this.query){
      this.search();
    }else{
      this.getProducts(labelerId);
    }
  }

  close(){
    this.formOpen = false;
  }

  selected(data: any){
    this.onSelectedChange.emit(data);
    this.closeModal();
  }

  multiSelected(){
    this.onMultiSelectedChange.emit(this.productsSelected);
    this.closeModal();
  }

  clrModalOpenChange(e) {
    this.onOpenChange.emit(e);
  }

  closeModal(){
    this.formOpen = false;
    this.onOpenChange.emit(false);
  }

  async getLabelerDetail(labelerId: string){
    try {
       let result: any = await this.labelerService.detail(labelerId);
       this.labelerDetail = result.detail;
    } catch (error) {
       this.alertService.serverError(error);
    }
  }

  getProducts(labelerId: string, query: string = "") {
    this.loadingProducts = true;
    this.productService.productsByLabeler(labelerId, query)
      .then((results: any) => {
        this.products = results.rows;
        this.loadingProducts = false;
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError();
      });
  } 

  search() {
      this.productsSearche = [];
      clearTimeout(this.timer);
      const that = this;
      this.timer = setTimeout(() => {
        if (this.query.length > 1) {
          that.isSearching = true;
          that.getProducts(this.labelerId, this.query);
        }

        if (!this.query) {
           that.getProducts(this.labelerId);
        }

      }, 300);
  }
}
