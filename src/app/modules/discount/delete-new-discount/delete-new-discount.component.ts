import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';

@Component({
  selector: 'app-delete-new-discount',
  templateUrl: './delete-new-discount.component.html',
  styleUrls: ['./delete-new-discount.component.scss']
})
export class DeleteNewDiscountComponent implements OnInit {

  @Input() discount_selected: any = null;
  @Output() discountsEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;

  constructor(public _discountsServices: DiscountService, public modal: NgbActiveModal, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountsServices.isLoading$;        
  }

  delete(){
    this._discountsServices.deleteDiscount(this.discount_selected.id).subscribe((resp:any) => {      
      this.discountsEvent.emit(this.discount_selected);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'El descuento se elimino correctamente'`});
      this.modal.close();      
    });
  }

}
