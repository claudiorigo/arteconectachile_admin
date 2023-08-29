import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CategorieService } from '../../_services/categorie.service';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.scss']
})
export class AddCategorieComponent implements OnInit {

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

  save(){
    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('icono', this.icono);
    formData.append('image_file', this.image_file);
    this._categorieService.crearCategoria(formData).subscribe((resp:any) => {
      this.categoriesEvent.emit(resp.categorie);
      this.toaster.open(NoticyAlertComponent, {text: `primary-'Categoría agregada exitosamente.'`});
      this.modal.close();
    });
  }

}
