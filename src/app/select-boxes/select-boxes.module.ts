import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBoxUnitsComponent } from './select-box-units/select-box-units.component';
import { FormsModule } from '@angular/forms';
import { SelectBudgetComponent } from './select-budget/select-budget.component';
import { SelectBidComponent } from './select-bid/select-bid.component';
import { StandardService } from 'app/services/standard.service';
import { SelectBidProcessComponent } from './select-bid-process/select-bid-process.component';
import { SelectSubBudgetComponent } from './select-sub-budget/select-sub-budget.component';
import { SelectOfficerComponent } from './select-officer/select-officer.component';
import { SelectOfficeComponent } from './select-office/select-office.component';
import { SelectCommitteeComponent } from './select-committee/select-committee.component';
import { OfficerService } from 'app/purchase/share/officer.service';
import { CommitteeService } from 'app/purchase/share/committee.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [StandardService, OfficerService, CommitteeService],
  declarations: [
    SelectBoxUnitsComponent,
    SelectBudgetComponent,
    SelectBidComponent,
    SelectBidProcessComponent,
    SelectSubBudgetComponent,
    SelectOfficerComponent,
    SelectOfficeComponent,
    SelectCommitteeComponent
  ],
  exports: [
    SelectBoxUnitsComponent,
    SelectBudgetComponent,
    SelectBidComponent,
    SelectBidProcessComponent,
    SelectSubBudgetComponent,
    SelectOfficerComponent,
    SelectOfficeComponent,
    SelectCommitteeComponent
  ]
})
export class SelectBoxesModule { }
