import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { ProductsService } from '../../../_services/products.service';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-item-inventario',
  templateUrl: './edit-item-inventario.component.html',
  styleUrls: ['./edit-item-inventario.component.scss']
})
export class EditItemInventarioComponent implements OnInit {

  
  @Output() inventarioEvent: EventEmitter<any> = new EventEmitter();
  @Input() inventario:any;

  isLoading$;
  name: any = null;

  constructor(public modal: NgbActiveModal, public _productService: ProductsService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoadingSubject;
    this.name = this.inventario.name;
  }

  save(){
    let data = {
      name: this.name,
    };
    this._productService.updateInventario(this.inventario.id, data).subscribe((resp:any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'${resp.message_error}'`});
        return;
      }else{
        this.inventarioEvent.emit(resp.product_size);
        this.modal.close();
        this.toaster.open(NoticyAlertComponent, {text: `primary-'Tamaño/Medida Actualizado.'`});
        return;
      }
    });
  }
}


