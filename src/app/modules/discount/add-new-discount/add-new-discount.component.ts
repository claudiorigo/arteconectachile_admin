import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';


@Component({
  selector: 'app-add-new-discount',
  templateUrl: './add-new-discount.component.html',
  styleUrls: ['./add-new-discount.component.scss']
})
export class AddNewDiscountComponent implements OnInit {

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

  constructor(public _discountsServices: DiscountService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._discountsServices.isLoading$;
    //this.allCupones();
    this.allCategoriasProductos();
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
      console.log(resp.cupones);      
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

  createDescuento(){    
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
      products_selected: this.products_selected,
      categories_selected: this.categories_selected,
    }
    

    this._discountsServices.createDiscount(data).subscribe((resp:any) => {
      console.log(resp);
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'Descuento creado exitosamente'`});        
        this.type_discount = 1;
        this.discount = null;        
        this.type = 1;
        this.start_date = null;
        this.end_date = null;
        this.products_selected = [];
        this.categories_selected = [];
        return;
      }
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'${resp.message_error}'`});
        return;
      }      
    });
  }

}
