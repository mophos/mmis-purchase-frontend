import { Component, OnInit, Input } from '@angular/core';
import { PurchasingOrderService } from 'app/purchase/share/purchasing-order.service';

@Component({
  selector: 'po-generic-issue',
  templateUrl: './generic-issue.component.html',
  styleUrls: ['./generic-issue.component.css']
})
export class GenericIssueComponent implements OnInit {

  @Input('genericId') genericId: any;
  @Input('day') day: any;
  amount:any
  loading: any= true
  constructor(
    private purchasingOrderService: PurchasingOrderService,
  ) { }

  ngOnInit() {
    this.getGenericIssue()
  }

  async getGenericIssue(){
    // loading = true
    let rs:any = await this.purchasingOrderService.getGenericIssue(this.genericId,this.day)
    if(rs)
      if(rs.rows)
        this.amount = rs.rows;
    console.log(rs);
    this.loading = false
  }
}
