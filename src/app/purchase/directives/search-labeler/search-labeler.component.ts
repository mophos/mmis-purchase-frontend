
import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-search-labeler',
  templateUrl: './search-labeler.component.html',
  styleUrls: ['./search-labeler.component.css']
})
export class SearchLabelerComponent implements OnInit {

 @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();
 @Input('labelerName') labelerName: string;
 @Input('labelerId') labelerId: string;
 @Input('placeholder') placeholder: string;


 token: any;
 datasource: any;

 constructor(
  private completerService: CompleterService,
  @Inject('API_URL') private apiUrl: string) 
{
  this.token = sessionStorage.getItem('token');
  const labererApiUrl = `${this.apiUrl}/labeler/autocomplete?token=${this.token}&query=`;
  this.datasource = this.completerService.remote(labererApiUrl, 'fullname', 'fullname');
}

ngOnInit() {
  this.placeholder = this.placeholder ? this.placeholder : 'เลือกผู้จำหน่าย...';
}

selected(event) {
  try {
    this.labelerName = `${event.title}`;
    this.onSelected.emit(event.originalObject);
  } catch (error) {

  }
}

clearProductSearch() {
  this.labelerName = null;
}

}
