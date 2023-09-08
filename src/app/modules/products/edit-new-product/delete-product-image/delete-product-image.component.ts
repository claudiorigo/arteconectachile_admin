import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';
import { ProductsService } from '../../_services/products.service';

@Component({
  selector: 'app-delete-product-image',
  templateUrl: './delete-product-image.component.html',
  styleUrls: ['./delete-product-image.component.scss']
})
export class DeleteProductImageComponent implements OnInit {

  @Input() image_file_array: any = null;
  @Output() productImageEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;
  URL_BACKEND: any = URL_BACKEND;  

  constructor(public modal: NgbActiveModal, public _productService: ProductsService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;        
  }

  delete(){
    this._productService.deleteProductImage(this.image_file_array.id).subscribe((resp:any) => {      
      this.productImageEvent.emit(this.image_file_array);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'La imagen se elimino correctamente'`});
      this.modal.close();      
    });
  }

}
