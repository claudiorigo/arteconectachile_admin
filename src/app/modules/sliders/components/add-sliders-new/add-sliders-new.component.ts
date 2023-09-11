import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { SlidersService } from '../../_services/sliders.service';

@Component({
  selector: 'app-add-sliders-new',
  templateUrl: './add-sliders-new.component.html',
  styleUrls: ['./add-sliders-new.component.scss']
})
export class AddSlidersNewComponent implements OnInit {

  @Output() slidersEvent: EventEmitter<any> = new EventEmitter();
  isLoading$: any;
  isLoading: boolean = false;
  name: any = null;
  url: any = null;
  image_file: any = null;
  image_preview: any = null;

  constructor(public _slidersService: SlidersService, public modal: NgbActiveModal, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;
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
    formData.append('url', this.url);
    formData.append('image_file', this.image_file);
    this._slidersService.crearSlider(formData).subscribe((resp:any) => {
      this.slidersEvent.emit(resp.slider);
      this.toaster.open(NoticyAlertComponent, {text: `primary-'Sliders agregado exitosamente.'`});
      this.modal.close();
    });
  }

}
