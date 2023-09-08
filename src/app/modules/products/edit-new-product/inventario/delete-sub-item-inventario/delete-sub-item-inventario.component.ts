import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../../_services/products.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-sub-item-inventario',
  templateUrl: './delete-sub-item-inventario.component.html',
  styleUrls: ['./delete-sub-item-inventario.component.scss']
})
export class DeleteSubItemInventarioComponent implements OnInit {

  @Input() sub_inventario: any = null;
  @Output() inventarioEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;

  constructor(public modal: NgbActiveModal, public _productService: ProductsService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;        
  }

  delete(){
    this._productService.deleteSubInventario(this.sub_inventario.id).subscribe((resp:any) => {
      console.log(resp);
      this.inventarioEvent.emit(this.sub_inventario);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'El tamaño se elimino correctamente'`});
      this.modal.close();      
    });
  }

}
