import { Injectable } from '@angular/core';

import { default as swal, SweetAlertType, SweetAlertOptions } from 'sweetalert2';

@Injectable()
export class AlertService {

  constructor() { }

  error(text = 'เกิดข้อผิดพลาด', title = '') {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    swal(option);

  }

  success(title = 'ดำเนินการเสร็จเรียบร้อย', text = '') {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'success',
      confirmButtonText: 'ตกลง',
      timer: 500
    };
    swal(option)
      .then(
      function () { },
      // handling the promise rejection
      function (dismiss) {
        if (dismiss === 'timer') { }
      }
      )

  }

  serverError(msg: string = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์') {

    const option: SweetAlertOptions = {
      title: 'เกิดข้อผิดพลาด',
      text: msg,
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    swal(option);

  }

  confirm(text = 'คุณต้องการดำเนินการนี้ ใช่หรือไม่?', title: string = '') {
    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ดำเนินการ!',
      cancelButtonText: 'ยกเลิก'
    };
    return swal(option);
  }
}
