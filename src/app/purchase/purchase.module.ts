import { GenericTypeService } from './share/generic-type.service';
import { OfficerService } from './share/officer.service';
import { PrintFormComponent } from './directives/print-form/print-form.component';
import { AdminGuard } from './share/admin-guard';
import { AccessCheck } from './share/access-check';
import { PurchaseCancelComponent } from './directives/purchase-cancel/purchase-cancel.component';
import { CommitteeFormComponent } from './committee/committee-form/committee-form.component';
import { CommitteeComponent } from './committee/committee.component';
import { ProductsSelectComponent } from './directives/products-select/products-select.component';
import { SelectUnitsComponent } from './directives/select-units/select-units.component';

import { PurchasingService } from './share/purchasing.service';
import { PurchasingOrderService } from './share/purchasing-order.service';
import { PurchasingOrderItemService } from './share/purchasing-orderitem.service';

import { Product } from './share/models/product.interface';
import { PeopleService } from './share/people.service';
import { BidProcessService } from './share/bid-process.service';
import { HolidayService } from './share/holiday.service';
import { BidtypeService } from './share/bidtype.service';
import { PackageService } from './share/package.service';
import { RequisitionService } from './share/requisition.service';
import { RequisitionItemService } from './share/requisition-item.service';
import { CommitteeService } from './share/committee.service';
import { BudgetTypeService } from './share/budget-type.service';
import { LabelerService } from './share/labeler.service';
import { ProductService } from './share/product.service';
import { ContractService } from './share/contract.service';
import { UploadFormComponent } from './directives/upload-form/upload-form.component';
import { CommitteePeopleService } from './share/committee-people.service';
import { UploadingService } from './share/uploading.service';
import { ContractProductsService } from './share/contract-products.service';
import { UnitService } from './share/unit.service';
import { AlertService } from '../alert.service';

import { ExpandPurchaseOrderComponent } from './expand-purchase-order/expand-purchase-order.component';
import { DatagridOrdersComponent } from './datagrid-orders/datagrid-orders.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderFormLayoutComponent } from './order-form-layout/order-form-layout.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { AuthModule } from './../auth/auth.module';
import { HelperModule } from '../helper/helper.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { Ag2CompleterModule, CompleterService } from 'ag2-completer';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { OrdersWarehouseComponent } from './orders-warehouse/orders-warehouse.component';
import { OrdersApproveComponent } from './orders-approve/orders-approve.component';
import { OrdersCancelComponent } from './orders-cancel/orders-cancel.component';
import { SelectProductsComponent } from './directives/select-products/select-products.component';
import { OrdersHistoryComponent } from './directives/orders-history/orders-history.component';
import { ReorderPointComponent } from './reorder-point/reorder-point.component';
import { RemainTotalPipe } from './pipes/remain-total.pipe';
import { SearchLabelerComponent } from './directives/search-labeler/search-labeler.component';
import { OrderStatusComponent } from './directives/order-status/order-status.component';
import { PrintComponent } from './print/print.component';
import { SelectOfficerComponent } from './directives/select-officer/select-officer.component';
import { SettingService } from 'app/purchase/share/setting.service';
import { BudgetTransectionService } from 'app/purchase/share/budget-transection.service';
import { AutocompleteModule } from 'app/autocomplete/autocomplete.module';
import { UnitsService } from 'app/services/units.service';
import { SelectBoxesModule } from 'app/select-boxes/select-boxes.module';
import { MappingCommitteeComponent } from './mapping-committee/mapping-committee.component';
import { PurchasingofficerComponent } from './officer/officer.component';
import { PurchaseOrderComponent } from './report/purchase-order/purchase-order.component';
import { GridReorderPointProductsComponent } from 'app/purchase/directives/grid-reorder-point-products/grid-reorder-point-products.component';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { ModalReceivesComponent } from './modal-receives/modal-receives.component';
import { ExpandReceiveItemsComponent } from './expand-receive-items/expand-receive-items.component';
import { ReceiveService } from 'app/purchase/share/receive.service';
import { TransactionPoComponent } from './directives/transaction-po/transaction-po.component';
import { BudgetRemainComponent } from './directives/budget-remain/budget-remain.component';
import { TransactionHistoryComponent } from './directives/transaction-history/transaction-history.component';

@NgModule({
  imports: [
    ClarityModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HelperModule,
    MyDatePickerTHModule,
    Ag2CompleterModule,
    AuthModule,
    AutocompleteModule,
    SelectBoxesModule,
    PurchaseRoutingModule,
    SelectBoxesModule
  ],
  declarations: [
    PurchaseCancelComponent,
    CommitteeComponent,
    CommitteeFormComponent,
    UploadFormComponent,
    DatagridOrdersComponent,
    ExpandPurchaseOrderComponent,
    ProductsSelectComponent,
    MainLayoutComponent,
    DashboardComponent,
    OrdersComponent,
    OrderFormComponent,
    OrderFormLayoutComponent,
    SelectUnitsComponent,
    OrdersWarehouseComponent,
    OrdersApproveComponent,
    OrdersCancelComponent,
    SelectProductsComponent,
    OrdersHistoryComponent,
    ReorderPointComponent,
    RemainTotalPipe,
    SearchLabelerComponent,
    OrderStatusComponent,
    PrintComponent,
    PrintFormComponent,
    SelectOfficerComponent,
    MappingCommitteeComponent,
    PurchasingofficerComponent,
    PurchaseOrderComponent,
    GridReorderPointProductsComponent,
    ModalLoadingComponent,
    ModalReceivesComponent,
    ExpandReceiveItemsComponent,
    TransactionPoComponent,
    BudgetRemainComponent,
    TransactionHistoryComponent
  ],
  providers: [
    BudgetTransectionService,
    GenericTypeService,
    OfficerService,
    SettingService,
    AdminGuard,
    AccessCheck,
    AlertService,
    PurchasingOrderService,
    PurchasingOrderItemService,
    PurchasingService,
    CompleterService,
    UnitService,
    AlertService,
    BidProcessService,
    BidtypeService,
    UploadingService,
    BudgetTypeService,
    LabelerService,
    ProductService,
    ContractService,
    PeopleService,
    PackageService,
    CommitteeService,
    CommitteePeopleService,
    PurchasingService,
    RequisitionService,
    RequisitionItemService,
    PurchasingOrderService,
    PurchasingOrderItemService,
    ContractProductsService,
    CompleterService,
    HolidayService,
    UnitsService,
    ReceiveService
  ]
})
export class PurchaseModule { }
