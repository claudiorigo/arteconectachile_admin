import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CouponsService } from '../_services/coupons.service';

@Component({
  selector: 'app-delete-new-coupon',
  templateUrl: './delete-new-coupon.component.html',
  styleUrls: ['./delete-new-coupon.component.scss']
})
export class DeleteNewCouponComponent implements OnInit {

  @Input() cupon_selected: any = null;
  @Output() couponsEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;

  constructor(public _couponsServices: CouponsService, public modal: NgbActiveModal, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._couponsServices.isLoading$;        
  }

  delete(){
    this._couponsServices.deleteCoupon(this.cupon_selected.id).subscribe((resp:any) => {      
      this.couponsEvent.emit(this.cupon_selected);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'El cupón se elimino correctamente'`});
      this.modal.close();      
    });
  }

}
