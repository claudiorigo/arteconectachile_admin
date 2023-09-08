import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../../_services/products.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-item-inventario',
  templateUrl: './delete-item-inventario.component.html',
  styleUrls: ['./delete-item-inventario.component.scss']
})
export class DeleteItemInventarioComponent implements OnInit {  

  @Input() inventario: any = null;
  @Output() inventarioEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;

  constructor(public modal: NgbActiveModal, public _productService: ProductsService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;        
  }

  delete(){
    this._productService.deleteInventario(this.inventario.id).subscribe((resp:any) => {      
      this.inventarioEvent.emit(this.inventario);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'El tamaño se elimino correctamente'`});
      this.modal.close();      
    });
  }
}
