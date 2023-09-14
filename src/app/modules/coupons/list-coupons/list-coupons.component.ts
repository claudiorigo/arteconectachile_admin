import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { CouponsService } from '../_services/coupons.service';
import { DeleteNewCouponComponent } from '../delete-new-coupon/delete-new-coupon.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-list-coupons',
  templateUrl: './list-coupons.component.html',
  styleUrls: ['./list-coupons.component.scss']
})
export class ListCouponsComponent implements OnInit {

  isLoading$: any;
  cupones: any = [];
  search: any = null;

  constructor(public _couponsServices: CouponsService, public toaster: Toaster, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading$ = this._couponsServices.isLoading$;
    this.allCupones();
  }

  allCupones(){
    this._couponsServices.allCoupons(1, this.search).subscribe((resp:any) => {
      this.cupones = resp.cupones;
    });
  }

  reset(){
    this.search = null;
    this.allCupones();
  }

  getTypeDiscount(value){
    if (value == 1) {
      return 'Porcentaje';
    } else {
      return 'Moneda';
    }
  }

  getTypeCount(cupon){
    if (cupon.type_count == 1) {
      return 'Ilimitado';
    } else {
      return "Limitado (" + cupon.num_use + ")";
    }
  }

  getTypeCoupon(cupon){
    if (cupon.products) {
      return 'Producto';
    } else {
      return 'Categoría';
    }
  }

  deleteCupon(cupon){
    const modalRef = this.modelService.open(DeleteNewCouponComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.cupon_selected = cupon;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.couponsEvent.subscribe((resp:any) => {
      let INDEX = this.cupones.findIndex(cupon => cupon.id == resp.id);
      this.cupones.splice(INDEX, 1);
    });
  }

}
