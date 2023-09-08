import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../_services/products.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  isLoading$;
  productos: any = [];
  search: any = null;

  constructor(public _productServices: ProductsService,) { }

  ngOnInit(): void {
    this.isLoading$ = this._productServices.isLoading$;
    this.allProducts();
  }
  
  allProducts(page=1){
    let LINK = '';
    if (this.search) {
      LINK = LINK + '&search=' + this.search;
    }
    this._productServices.allProducts(page, LINK).subscribe((resp:any) => {      
      this.productos = resp.productos.data;
    });
  }

  reset(){
    this.search = null;
    this.allProducts();
  }


  editProduct(product){

  }

  delete(product){

  }

}
