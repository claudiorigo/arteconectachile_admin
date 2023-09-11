import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { URL_BACKEND } from 'src/app/config/config';
import { SlidersService } from '../../_services/sliders.service';

@Component({
  selector: 'app-delete-sliders-new',
  templateUrl: './delete-sliders-new.component.html',
  styleUrls: ['./delete-sliders-new.component.scss']
})
export class DeleteSlidersNewComponent implements OnInit {

  @Input() slider_selected: any = null;
  @Output() slidersEvent: EventEmitter<any> = new EventEmitter();
  isLoading$;
  isLoading = false;
  URL_BACKEND: any = URL_BACKEND;  

  constructor(public modal: NgbActiveModal, public _slidersService: SlidersService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;        
  }

  delete(){
    this._slidersService.deleteSlider(this.slider_selected.id).subscribe((resp:any) => {      
      this.slidersEvent.emit(this.slider_selected);      
      this.toaster.open(NoticyAlertComponent, {text: `success-'El slider se elimino correctamente'`});
      this.modal.close();      
    });
  }

}
