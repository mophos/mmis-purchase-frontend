import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from 'app/alert.service';
import { ReceiveService } from 'app/purchase/share/receive.service';

@Component({
  selector: 'app-expand-receive-items',
  templateUrl: './expand-receive-items.component.html',
  styles: []
})
export class ExpandReceiveItemsComponent implements OnInit {

  @Input() receiveId: any;
  loading = false;
  products = [];

  constructor(private alertService: AlertService, private receiveService: ReceiveService) { }

  ngOnInit() {
    this.getProductList(this.receiveId);
  }

  async getProductList(receiveId) {
    this.loading = true;
    try {
      const result: any = await this.receiveService.getReceiveItems(receiveId);
      this.loading = false;
      if (result.ok) {
        this.products = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }



}
