import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoxUnitsComponent } from './select-box-units/select-box-units.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [SelectBoxUnitsComponent],
  exports: [SelectBoxUnitsComponent]
})
export class SelectBoxesModule { }
