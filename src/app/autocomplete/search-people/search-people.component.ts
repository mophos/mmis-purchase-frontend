import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';

@Component({
  selector: 'app-search-people',
  templateUrl: './search-people.component.html',
  styles: []
})
export class SearchPeopleComponent implements OnInit {
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  _disabled = false;

  @Input('disabled')
  set setDisabled(value: boolean) {
    this._disabled = value;
  }

  token: any;
  query: any = null;
  url: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.url = `${this.apiUrl}/people/autocomplete?token=${this.token}`;
  }

  ngOnInit() {
  }

  clearResult() {
    this.query = null;
  }

  clearSelected(event: any) {
    if (event) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        this.onChange.emit(false);
      } else {
        this.onChange.emit(true);
      }
    } else {
      this.onChange.emit(false);
    }
  }

  handleResultSelected(event: any) {
    if (event) {
      this.onSelect.emit(event);
      this.query = event.fullname;
    } else {
      this.query = null;
    }
  }

  setSelected(peopleName: any) {
    this.query = peopleName;
  }

}
