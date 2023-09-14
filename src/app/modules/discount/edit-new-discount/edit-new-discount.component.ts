import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-edit-new-discount',
  templateUrl: './edit-new-discount.component.html',
  styleUrls: ['./edit-new-discount.component.scss']
})
export class EditNewDiscountComponent implements OnInit {

  isLoading$: any;  
  type_discount: any = 1;
  discount: any = null;  
  products_selected: any = [];
  categories_selected: any = [];
  //
  type: any = 1;
  productos: any = [];
  categorias: any = [];
  product_id: any = null;
  categorie_id: any = null;
  start_date: any = null;
  end_date: any = null;
  discount_id: any = null;
  state: any = null;
  discount_selected: any = {
    'code': '',
  }

  constructor(public _discountsServices: DiscountService, public toaster: Toaster, public router: Router, public activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountsServices.isLoading$;
    this.activatedRoute.params.subscribe((resp:any) => {
      this.discount_id = resp['id'];
    });
    
    this.allCategoriasProductos();

    this._discountsServices.showDescuento(this.discount_id).subscribe((resp:any) => {
      this.discount_selected = resp.descuento;
      this.type_discount = this.discount_selected.type_discount;
      this.discount = this.discount_selected.discount;      
      this.start_date = this.discount_selected.start_date;
      this.end_date = this.discount_selected.end_date;
      this.type = this.discount_selected.type;
      this.state = this.discount_selected.state;
      if (this.type == 1) {
        this.discount_selected.products.forEach(element => {
          let PRODUCTO = this.productos.find(producto => producto.id == element.product_id);
          this.products_selected.push({
            id: PRODUCTO.id,
            name: PRODUCTO.name,
          });
        });
      }
      if (this.type == 2) {
        this.discount_selected.categories.forEach(element => {
          let CATEGORIE = this.categorias.find(categoria => categoria.id == element.categorie_id);
          this.categories_selected.push({
            id: CATEGORIE.id,
            name: CATEGORIE.name,
          });
        });
      }
    });
    //this.allDiscounts();
  }

  allCategoriasProductos(){
    this._discountsServices.allCategoriesProducts().subscribe((resp:any) => {      
      this.productos = resp.productos;
      this.categorias = resp.categorias;
    });
  }  

  checkedTypeDesc(value){
    this.type_discount = value;
  }

  checkedTypeCoupon(value){
    this.type = value;
    this.products_selected = [];
    this.categories_selected = [];
    this.product_id = null;
    this.categorie_id = null;
  }

  allDiscounts(page=1){
    this._discountsServices.allDiscounts(page).subscribe((resp:any) => {
      console.log(resp.descuentos.data);      
    });
  } 
  
  deleteProduct(producto){
    let INDEX = this.products_selected.findIndex(product => product.id == producto.id);
    if (INDEX != -1) {
      this.products_selected.splice(INDEX, 1);
    }
  }

  deleteCategorie(categoria){
    let INDEX = this.categories_selected.findIndex(categorie => categorie.id == categoria.id);
    if (INDEX != -1) {
      this.categories_selected.splice(INDEX, 1);
    }
  }

  addObject(){
    if (this.type == 1) {
      let PRODUCT = this.productos.find(item => item.id == this.product_id);
      let INDEX = this.products_selected.findIndex(item => item.id == this.product_id);
      if (INDEX != -1) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'El producto ya fue agregado'`});
        return;
      } else {
        this.product_id = null;
        this.products_selected.push({
          name: PRODUCT.name,
          id: PRODUCT.id,
        });
      }
    } else {
      let CATEGORIE = this.categorias.find(item => item.id == this.categorie_id);
      let INDEX = this.categories_selected.findIndex(item => item.id == this.categorie_id);
      if (INDEX != -1) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'La categoría ya fue agregada'`});
        return;
      } else {
        this.categorie_id = null;
        this.categories_selected.push({
          name: CATEGORIE.name,
          id: CATEGORIE.id,
        });
      }
    }
  }

  actualizarDescuento(){    
    if (this.discount <= 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El descuento debe ser mayor a 0'`});
      return;
    }
    if (!this.start_date || !this.end_date) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Fechas de inicio y fin son obligatorias'`});
      return;
    }
    if (this.type == 1 && this.products_selected.length == 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Necesitas [+] agregar 1 producto'`});
      return;
    }
    if (this.type == 2 && this.categories_selected.length == 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Necesitas [+] agregar 1 categoría'`});
      return;
    }

    let data = {      
      type_discount: this.type_discount,
      discount: this.discount,      
      type: this.type,
      start_date: this.start_date,
      end_date: this.end_date,
      state: this.state,
      products_selected: this.products_selected,
      categories_selected: this.categories_selected,
    }    

    this._discountsServices.updateDiscount(this.discount_id, data).subscribe((resp:any) => {
      //console.log(resp);
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'Descuento actualizado exitosamente'`});
        return;
      }
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'${resp.message_error}'`});
        return;
      }      
    });
  }

}
