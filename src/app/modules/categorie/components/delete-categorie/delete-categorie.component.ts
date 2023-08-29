import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategorieService } from '../../_services/categorie.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-delete-categorie',
  templateUrl: './delete-categorie.component.html',
  styleUrls: ['./delete-categorie.component.scss']
})
export class DeleteCategorieComponent implements OnInit {

  @Input() categoria_selected: any = null;
  @Output() categoriesEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;
  URL_BACKEND: any = URL_BACKEND;  

  constructor(public modal: NgbActiveModal, public _categorieService: CategorieService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._categorieService.isLoading$;        
  }

  delete(){
    this._categorieService.deleteCategoria(this.categoria_selected.id).subscribe((resp:any) => {      
      this.categoriesEvent.emit(this.categoria_selected);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'La categoría se elimino correctamente'`});
      this.modal.close();      
    });
  }
}
