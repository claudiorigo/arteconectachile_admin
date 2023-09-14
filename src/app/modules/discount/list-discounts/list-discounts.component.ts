import { Component, OnInit } from '@angular/core';
import { DeleteNewDiscountComponent } from '../delete-new-discount/delete-new-discount.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { DiscountService } from '../_services/discount.service';

@Component({
  selector: 'app-list-discounts',
  templateUrl: './list-discounts.component.html',
  styleUrls: ['./list-discounts.component.scss']
})
export class ListDiscountsComponent implements OnInit {

  isLoading$: any;
  descuentos: any = [];
  search: any = null;

  constructor(public _discountsServices: DiscountService, public toaster: Toaster, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountsServices.isLoading$;
    this.allDescuentos();
  }

  allDescuentos(){
    this._discountsServices.allDiscounts(1, this.search).subscribe((resp:any) => {
      this.descuentos = resp.descuentos.data;
    });
  }

  reset(){
    this.search = null;
    this.allDescuentos();
  }

  getTypeDiscount(value){
    if (value == 1) {
      return 'Porcentaje';
    } else {
      return 'Moneda';
    }
  }

  getTypeCategorieProduct(descuento){    
    if (descuento == 1) {
      return 'Producto';
    } else {
      return 'Categoría';
    }
  }  

  deleteDescuento(descuento){
    const modalRef = this.modelService.open(DeleteNewDiscountComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.discount_selected = descuento;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.discountsEvent.subscribe((resp:any) => {
      let INDEX = this.descuentos.findIndex(descuento => descuento.id == resp.id);
      this.descuentos.splice(INDEX, 1);
    });
  }

}
