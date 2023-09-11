import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './coupons.component';
import { ListCouponsComponent } from './list-coupons/list-coupons.component';
import { AddNewCouponComponent } from './add-new-coupon/add-new-coupon.component';
import { EditNewCouponComponent } from './edit-new-coupon/edit-new-coupon.component';
import { DeleteNewCouponComponent } from './delete-new-coupon/delete-new-coupon.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';


@NgModule({
  declarations: [CouponsComponent, ListCouponsComponent, AddNewCouponComponent, EditNewCouponComponent, DeleteNewCouponComponent],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    //
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
  ]
})
export class CouponsModule { }
