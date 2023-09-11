import { Component, OnInit } from '@angular/core';
import { SlidersService } from '../_services/sliders.service';
import { AddSlidersNewComponent } from '../components/add-sliders-new/add-sliders-new.component';
import { EditSlidersNewComponent } from '../components/edit-sliders-new/edit-sliders-new.component';
import { DeleteSlidersNewComponent } from '../components/delete-sliders-new/delete-sliders-new.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-sliders-lists',
  templateUrl: './sliders-lists.component.html',
  styleUrls: ['./sliders-lists.component.scss']
})
export class SlidersListsComponent implements OnInit {

  isLoading$;  
  sliders: any = [];
  URL_BACKEND: any = URL_BACKEND;

  constructor(public _slidersService: SlidersService, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading$ = this._slidersService.isLoading$;
    this.allSliders();
  }

  allSliders(){
    this._slidersService.allSliders().subscribe((resp:any) => {
      this.sliders = resp.sliders;
    });
  }  

  addSlider(){
    const modalRef = this.modelService.open(AddSlidersNewComponent, {centered: true, size: 'md'});
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.slidersEvent.subscribe((resp:any) => {
      this.sliders.unshift(resp);
    });
  }

  editSlider(slider){
    const modalRef = this.modelService.open(EditSlidersNewComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.slider_selected = slider;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.slidersEvent.subscribe((resp:any) => {
      let INDEX = this.sliders.findIndex(slider => slider.id == resp.id);
      this.sliders[INDEX] = resp;
    });
  }

  delete(slider){
    const modalRef = this.modelService.open(DeleteSlidersNewComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.slider_selected = slider;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.slidersEvent.subscribe((resp:any) => {
      let INDEX = this.sliders.findIndex(slider => slider.id == resp.id);
      this.sliders.splice(INDEX, 1);
    });
  }

}
