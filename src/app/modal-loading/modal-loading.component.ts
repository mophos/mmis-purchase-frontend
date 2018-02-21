import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-loading',
  templateUrl: './modal-loading.component.html',
  styles: []
})
export class ModalLoadingComponent implements OnInit {
  opened: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  show() {
    setTimeout(() => {
      this.opened = true;
    }, 500);
  }

  hide() {
    setTimeout(() => {
      this.opened = false;
    }, 500);
  }

  
}
