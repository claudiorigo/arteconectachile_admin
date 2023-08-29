import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../_services/categorie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategorieComponent } from '../components/add-categorie/add-categorie.component';
import { URL_BACKEND } from '../../../config/config';
import { EditCategorieComponent } from '../components/edit-categorie/edit-categorie.component';
import { DeleteCategorieComponent } from '../components/delete-categorie/delete-categorie.component';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.scss']
})
export class CategorieListComponent implements OnInit {

  isLoading$;
  search: any = null;
  categorias: any = [];
  URL_BACKEND: any = URL_BACKEND;

  constructor(public _categorieService: CategorieService, public modelService: NgbModal) { }

  ngOnInit(): void {
    this.isLoading$ = this._categorieService.isLoading$;
    this.allCategories();
  }

  allCategories(){
    this._categorieService.allCategories(1, this.search).subscribe((resp:any) => {
      this.categorias = resp.categorias;
    });
  }

  reset(){
    this.search = null;
    this.allCategories();
  }

  addCategorie(){
    const modalRef = this.modelService.open(AddCategorieComponent, {centered: true, size: 'md'});
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.categoriesEvent.subscribe((resp:any) => {
      this.categorias.unshift(resp);
    });
  }

  editCategorie(categoria){
    const modalRef = this.modelService.open(EditCategorieComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.categoria_selected = categoria;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.categoriesEvent.subscribe((resp:any) => {
      let INDEX = this.categorias.findIndex(categoria => categoria.id == resp.id);
      this.categorias[INDEX] = resp;
    });
  }

  delete(categoria){
    const modalRef = this.modelService.open(DeleteCategorieComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.categoria_selected = categoria;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.categoriesEvent.subscribe((resp:any) => {
      let INDEX = this.categorias.findIndex(categoria => categoria.id == resp.id);
      this.categorias.splice(INDEX, 1);
    });
  }
}
