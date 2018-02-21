import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToThaiDatePipe } from './to-thai-date.pipe';
import { NumberOnlyDirective } from './number-only.directive';
import { ConvertTimestampPipe } from './convert-timestamp.pipe';
import { RoundPipe } from './round.pipe';
import { HtmlPreviewComponent } from './html-preview/html-preview.component';
import { NumberWithoutDotDirective } from 'app/helper/number-without-dot.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ToThaiDatePipe,
    NumberOnlyDirective,
    ConvertTimestampPipe,
    RoundPipe,
    HtmlPreviewComponent,
    NumberWithoutDotDirective
  ],
  exports: [
    ToThaiDatePipe,
    NumberOnlyDirective,
    ConvertTimestampPipe,
    RoundPipe,
    HtmlPreviewComponent,
    NumberWithoutDotDirective
  ]
})
export class HelperModule { }
