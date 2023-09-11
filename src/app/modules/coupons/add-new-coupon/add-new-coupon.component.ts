import { Component, OnInit } from '@angular/core';
import { CouponsService } from '../_services/coupons.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';


@Component({
  selector: 'app-add-new-coupon',
  templateUrl: './add-new-coupon.component.html',
  styleUrls: ['./add-new-coupon.component.scss']
})
export class AddNewCouponComponent implements OnInit {

  isLoading$: any;
  code: any = null;
  type_discount: any = 1;
  discount: any = null;
  type_count: any = 1;
  num_use: any = 0;  
  products_selected: any = [];
  categories_selected: any = [];
  //
  type_coupon: any = 1;
  productos: any = [];
  categorias: any = [];
  product_id: any = null;
  categorie_id: any = null;

  constructor(public _couponsServices: CouponsService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._couponsServices.isLoading$;
    //this.allCupones();
    this.allCategoriasProductos();
  }

  allCategoriasProductos(){
    this._couponsServices.allCategoriesProducts().subscribe((resp:any) => {      
      this.productos = resp.productos;
      this.categorias = resp.categorias;
    });
  }  

  checkedTypeDesc(value){
    this.type_discount = value;
  }

  checkedTypeUso(value){
    this.type_count = value;
  }

  checkedTypeCoupon(value){
    this.type_coupon = value;
    this.products_selected = [];
    this.categories_selected = [];
    this.product_id = null;
    this.categorie_id = null;
  }

  allCupones(page=1){
    this._couponsServices.allCoupons(page).subscribe((resp:any) => {
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
    if (this.type_coupon == 1) {
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

  createCoupon(){
    if (!this.code) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Agregar un código de cupón'`});
      return;
    }
    if (this.discount <= 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El descuento debe ser mayor a 0'`});
      return;
    }    
    if (this.type_count == 2 && this.num_use <= 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El numero de uso debe ser mayo a 0'`});
      return;
    }
    if (this.type_coupon == 1 && this.products_selected.length == 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Necesitas [+] agregar 1 producto'`});
      return;
    }
    if (this.type_coupon == 2 && this.categories_selected.length == 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Necesitas [+] agregar 1 categoría'`});
      return;
    }

    let data = {
      code: this.code,
      type_discount: this.type_discount,
      discount: this.discount,
      type_count: this.type_count,
      num_use: this.num_use,
      type_coupon: this.type_coupon,
      products_selected: this.products_selected,
      categories_selected: this.categories_selected,
    }

    this._couponsServices.createCoupon(data).subscribe((resp:any) => {
      //console.log(resp);
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'Cupón creado exitosamente'`});
        this.code = null;
        this.type_discount = 1;
        this.discount = null;
        this.type_count = 1;
        this.num_use = 0;
        this.type_coupon = 1;
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
