import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoxUnitsComponent } from './select-box-units/select-box-units.component';
import { FormsModule } from '@angular/forms';
import { SelectBudgetComponent } from './select-budget/select-budget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [SelectBoxUnitsComponent, SelectBudgetComponent],
  exports: [SelectBoxUnitsComponent]
})
export class SelectBoxesModule { }
