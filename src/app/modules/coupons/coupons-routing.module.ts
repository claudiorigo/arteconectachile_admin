import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from './coupons.component';
import { AddNewCouponComponent } from './add-new-coupon/add-new-coupon.component';
import { EditNewCouponComponent } from './edit-new-coupon/edit-new-coupon.component';
import { ListCouponsComponent } from './list-coupons/list-coupons.component';

const routes: Routes = [
  {
    path: '',
    component: CouponsComponent,
    children: [
      {
        path: 'registrar-cupon',
        component: AddNewCouponComponent,
      },
      {
        path: 'editar-cupon/:id',
        component: EditNewCouponComponent,
      },
      {
        path: 'listar-cupones',
        component: ListCouponsComponent,
      },
      {
        path: '', redirectTo: 'listar-cupones', pathMatch: 'full',        
      },
      {
        path: '**', redirectTo: 'listar-cupones', pathMatch: 'full',        
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
