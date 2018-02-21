import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
})
export class OrderStatusComponent implements OnInit {

private _status: string;

@Input() set status(value: string) {
   this._status = value;
   this.updateStatus();
}

get status(): string {
    return this._status;
}

statusText: string;
statusCss: string;

  constructor() { }

  ngOnInit() {
   this.updateStatus();
  }

  updateStatus(){
    this.statusText =  this.getStatusLabel();
    this.statusCss  =  this.getStatusLabel('color');
  }

  getStatusLabel(type: string = 'label'){
    let label: string;
    let color: string;
    switch (this._status){
      case 'PREPARED': 
        label = 'เตรียมใบสั่งซื้อ'; 
        color = ' label label-warning'; 
      break;
      case 'CONFIRMED':
        label = 'ยืนยันการสั่งซื้อ';
        color = 'label label-info'; 
      break;
      case 'APPROVED': 
        label = 'อนุมัติใบสั่งซื้อ'; 
        color = 'label label-success'; 
      break;
      case 'COMPLETED': 
        label = 'รับเข้าคลัง';
        color = 'label label-muted'; 
      break;
      case 'COMPLETED': 
        label = 'ยกเลิก'; 
        color = 'label label-danger'; 
        break;
      default:
          label = 'เตรียมใบสั่งซื้อ'; 
          color = 'label label-info'; 
      break;
    }
    return type === 'color' ? color : label ;
  }

}
