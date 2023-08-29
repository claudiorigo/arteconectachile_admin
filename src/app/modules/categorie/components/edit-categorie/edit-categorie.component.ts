import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategorieService } from '../../_services/categorie.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.scss']
})
export class EditCategorieComponent implements OnInit {

  @Input() categoria_selected: any;
  @Output() categoriesEvent: EventEmitter<any> = new EventEmitter();
  isLoading$: any;
  isLoading: boolean = false;
  name: any = null;
  icono: any = null;
  image_file: any = null;
  image_preview: any = null;

  constructor(public _categorieService: CategorieService, public modal: NgbActiveModal, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._categorieService.isLoading$;
    this.name = this.categoria_selected.name;
    this.icono = this.categoria_selected.icono;
    this.image_preview = URL_BACKEND + 'storage/' + this.categoria_selected.imagen;
  }  

  processFile($event){
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El formato debe ser imagen.'`});
      return;
    }
    this.image_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.image_file);
    reader.onloadend = () => this.image_preview = reader.result;    
  }

  editar(){
    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('icono', this.icono);
    formData.append('image_file', this.image_file);
    this._categorieService.updateCategoria(this.categoria_selected.id, formData).subscribe((resp:any) => {
      this.categoriesEvent.emit(resp.categorie);
      this.toaster.open(NoticyAlertComponent, {text: `primary-'Categoría actualizada exitosamente.'`});
      this.modal.close();
    });
  }

}
