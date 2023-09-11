import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CouponsService } from '../_services/coupons.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-new-coupon',
  templateUrl: './edit-new-coupon.component.html',
  styleUrls: ['./edit-new-coupon.component.scss']
})
export class EditNewCouponComponent implements OnInit {

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
  //
  coupon: any = {
    code: '',
  }
  coupon_id: any = null;
  state: any = 1;

  constructor(public _couponsServices: CouponsService, public toaster: Toaster, public router: Router, public activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.isLoading$ = this._couponsServices.isLoading$;
    this.activatedRoute.params.subscribe((resp:any) => {
      this.coupon_id = resp.id || '';
    });
    //this.allCupones();
    this.allCategoriasProductos();
    this.showCupon();    
  }

  allCategoriasProductos(){
    this._couponsServices.allCategoriesProducts().subscribe((resp:any) => {      
      this.productos = resp.productos;
      this.categorias = resp.categorias;
    });
  }

  showCupon(){
    this._couponsServices.showCoupon(this.coupon_id).subscribe((resp:any) => {
      //console.log(resp);
      this.coupon = resp.cupon;
      
      this.code = this.coupon.code;
      this.type_discount = this.coupon.type_discount;
      this.discount = this.coupon.discount;
      this.type_count = this.coupon.type_count;
      this.num_use = this.coupon.num_use;
      this.state = this.coupon.state;
      this.type_coupon = this.coupon.products ? 1 : 2;

      if (this.type_coupon == 1) {
        let PRODUCTS = this.coupon.products.split(',');
        PRODUCTS.forEach(product_id => {
          let PRODUCT = this.productos.find(item => item.id == product_id);
          this.products_selected.push({
            name: PRODUCT.name,
            id: PRODUCT.id,
          })
        });
      }

      if (this.type_coupon == 2) {
        let CATEGORIES = this.coupon.categories.split(',');
        CATEGORIES.forEach(categorie_id => {
          let CATEGORIE = this.categorias.find(item => item.id == categorie_id);
          this.categories_selected.push({
            name: CATEGORIE.name,
            id: CATEGORIE.id,
          })
        });
      }

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

  /* allCupones(page=1){
    this._couponsServices.allCoupons(page).subscribe((resp:any) => {
      console.log(resp.cupones);      
    });
  }  */
  
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

  editCoupon(){
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
      state: this.state,
      type_coupon: this.type_coupon,
      products_selected: this.products_selected,
      categories_selected: this.categories_selected,
    }

    this._couponsServices.updateCoupon(this.coupon.id,data).subscribe((resp:any) => {
      console.log(resp);
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'Cupón actualizado exitosamente'`});        
        return;
      }
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'${resp.message_error}'`});
        return;
      }      
    });
  }

}
