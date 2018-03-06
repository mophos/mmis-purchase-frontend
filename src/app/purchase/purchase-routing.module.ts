import { PurchaseOrderComponent } from './report/purchase-order/purchase-order.component';
import { PurchasingofficerComponent } from './officer/officer.component';
import { MappingCommitteeComponent } from './mapping-committee/mapping-committee.component';
import { PrintComponent } from './print/print.component';
import { CommitteeComponent } from './committee/committee.component';
import { ReorderPointComponent } from './reorder-point/reorder-point.component';
import { OrdersCancelComponent } from './orders-cancel/orders-cancel.component';
import { OrdersApproveComponent } from './orders-approve/orders-approve.component';
import { OrdersWarehouseComponent } from './orders-warehouse/orders-warehouse.component';
import { AuthGuard } from './../auth-guard.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrdersComponent } from './orders/orders.component';
import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'purchase',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reorder-point', component: ReorderPointComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders-approve', component: OrdersApproveComponent },
      { path: 'orders-warehouse', component: OrdersWarehouseComponent },
      { path: 'orders-cancel', component: OrdersCancelComponent },
      { path: 'new', component: OrderFormComponent },
      { path: 'edit', component: OrderFormComponent },
      { path: 'committee', component: CommitteeComponent },
      { path: 'mapping-committee', component: MappingCommitteeComponent },
      { path: 'print', component: PrintComponent },
      { path: 'officer', component: PurchasingofficerComponent },
      { path: 'report/purchase-order', component: PurchaseOrderComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
