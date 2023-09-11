import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductsService } from '../_services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductImageComponent } from './delete-product-image/delete-product-image.component';
import { EditItemInventarioComponent } from './inventario/edit-item-inventario/edit-item-inventario.component';
import { DeleteItemInventarioComponent } from './inventario/delete-item-inventario/delete-item-inventario.component';
import { EditSubItemInventarioComponent } from './inventario/edit-sub-item-inventario/edit-sub-item-inventario.component';
import { DeleteSubItemInventarioComponent } from './inventario/delete-sub-item-inventario/delete-sub-item-inventario.component';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {

  isLoading$: any;  
  name: any = null;
  sku: any = null;
  description_short: any = null;
  description: any = null;
  price_pesos: any = '';
  price_usd: any = '';
  state: any = 1;
  image_file: any = null;
  product_stock: any = 0;
  tags: any = [];
  categorie_id: any = '';
  image_preview: any = '';
  text: any = null;
  images_files: any = null;
  images_previews: any = null;
  images_files_array: any = [];
  categorias: any = [];
  product_id: any = null;
  producto: any = {
    name: '',
  };
  //NUEVO EDIT SIZE/COLOR/STOCK
  product_size_id: any = null;
  product_size_new: any = null;
  product_color_id: any = null;
  stock: any = null;
  products_colors: any = [];
  products_sizes: any = [];
  is_selected_size: Boolean = true;
  product_inventario: any = [];
  checked_intentario: any = 1;  

  constructor(public _productService: ProductsService, public toaster: Toaster, public router: Router, public activatedRoute: ActivatedRoute, public modelService: NgbModal) { }

  ngOnInit(): void {    
    this.isLoading$ = this._productService.isLoading$;

    this.activatedRoute.params.subscribe((resp:any) => {
      this.product_id = resp.id || '';
    });

    this._productService.getCategories().subscribe((resp:any) => {
      this.categorias = resp.categorias;      
    });

    this._productService.allProductsColors().subscribe((resp:any) => {
      this.products_colors = resp.products_colors;
    });

    this._productService.allProductsSizes().subscribe((resp:any) => {
      this.products_sizes = resp.products_sizes;
    });

    this._productService.showProduct(this.product_id).subscribe((resp:any) => {
      //console.log(resp);
      this.producto = resp.producto;
      this.name = this.producto.name;
      //slug
      this.sku = this.producto.sku;
      this.description_short = this.producto.description_short;
      this.description = this.producto.description;
      this.price_pesos = this.producto.price_pesos;
      this.price_usd = this.producto.price_usd;
      this.state = this.producto.state;
      this.image_preview = this.producto.imagen;
      this.product_stock = this.producto.stock;
      this.tags = this.producto.tags_array;
      this.checked_intentario = this.producto.checked_intentario;
      this.categorie_id = this.producto.categorie_id;
      this.images_files_array = this.producto.images;
      this.product_inventario = this.producto.size;
    })
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false)
    }, 50);
  }

  checkedInventario(value){
    this.checked_intentario = value;
  }

  processFile($event){
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El formato debe ser imagen.'`});
      return;
    }
    if ($event.target.files) {
      this.image_file = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = ($event:any) => {
        this.image_preview = $event.target.result;
        this.loadServices();
      }
    }       
  }

  addTags(){
    this.tags.push(this.text);
    this.text = null;
  }

  removeTags(index){
    this.tags.splice(index, 1);
  }

  addFiles($event){
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'El formato debe ser imagen.'`});
      return;
    }
    this.images_files = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.images_files);
    reader.onloadend = () => this.images_previews = reader.result;
  }

  addImages(){
    if (!this.images_files) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Debe agregar una imagen.'`});
      return;
    }
    let formData = new FormData();
    formData.append('product_id', this.product_id);
    formData.append('file', this.images_files);
    this._productService.addProductImage(formData).subscribe((resp:any) => {
      this.images_files = null;
      this.images_previews = null;
      this.images_files_array.unshift(resp.product_imagen);
    });
  }

  removeImages(image_file_array){
    const modalRef = this.modelService.open(DeleteProductImageComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.image_file_array = image_file_array;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.productImageEvent.subscribe((resp:any) => {
      let INDEX = this.images_files_array.findIndex(productImagen => productImagen.id == resp.id);
      this.images_files_array.splice(INDEX, 1);
    });
  }

  openEdit(inventario){
    const modalRef = this.modelService.open(EditItemInventarioComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.inventario = inventario;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.inventarioEvent.subscribe((resp:any) => {
      //console.log(resp);
      let INDEX = this.product_inventario.findIndex(item => item.id == resp.id);
      if (INDEX != -1) {
        this.product_inventario[INDEX] = resp;
      }
    })
  }

  openDelete(inventario){
    const modalRef = this.modelService.open(DeleteItemInventarioComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.inventario = inventario;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.inventarioEvent.subscribe((resp:any) => {
      //console.log(resp);
      let INDEX = this.product_inventario.findIndex(item => item.id == resp.id);
      if (INDEX != -1) {
        this.product_inventario.splice(INDEX, 1);
      }
    })
  }

  openSubEdit(sub_inventario, inventario){
    const modalRef = this.modelService.open(EditSubItemInventarioComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.sub_inventario = sub_inventario;
    modalRef.componentInstance.inventario = inventario;
    modalRef.componentInstance.products_colors = this.products_colors
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.inventarioEvent.subscribe((resp:any) => {
      //console.log(resp);
      let INDEX = this.product_inventario.find(item => item.id == inventario.id).variaciones.findIndex(item => item.id == resp.id);
      if (INDEX != -1) {
        this.product_inventario.find(item => item.id == inventario.id).variaciones[INDEX] = resp;
      }
    })
  }

  openSubDelete(sub_inventario, inventario){
    const modalRef = this.modelService.open(DeleteSubItemInventarioComponent, {centered: true, size: 'md'});
    modalRef.componentInstance.sub_inventario = sub_inventario;
    modalRef.result.then(() => {}, () => {})
    modalRef.componentInstance.inventarioEvent.subscribe((resp:any) => {
      //console.log(resp);
      let INDEX = this.product_inventario.find(item => item.id == inventario.id).variaciones.findIndex(item => item.id == resp.id);
      if (INDEX != -1) {
        this.product_inventario.find(item => item.id == inventario.id).variaciones.splice(INDEX, 1);
      }
    })
  }

  editProduct(){   
    if (! this.name || ! this.sku || ! this.description_short || ! this.description || ! this.price_pesos || ! this.price_usd || ! this.tags || ! this.categorie_id) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Todos los campos son obligatorios'`});
      return;
    }
    let formDate = new FormData();
    formDate.append('name', this.name);
    formDate.append('sku', this.sku);
    formDate.append('description_short', this.description_short);
    formDate.append('description', this.description);
    formDate.append('price_pesos', this.price_pesos);
    formDate.append('price_usd', this.price_usd);
    formDate.append('state', this.state);
    formDate.append('image_file', this.image_file);
    formDate.append('stock', this.product_stock ? this.product_stock : 0);
    formDate.append('tags', this.tags);
    formDate.append('type_inventario', this.checked_intentario);
    formDate.append('categorie_id', this.categorie_id);
    this._productService.updateProduct(this.product_id, formDate).subscribe((resp:any) => {
      //console.log("Editado crear message api");
      this.toaster.open(NoticyAlertComponent, {text: `primary-'Producto editado exitosamente.'`});
      return;
    })
  }

  changeSizes($event){
    if ($event) {
      this.is_selected_size = false;
    }else{
      this.is_selected_size = true;
    }
  }

  addInventario(){
    if (!this.product_size_id) {
      if (!this.product_size_new) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'Ingresa nombre de tamaño.'`});
        return;        
      }
    }
    if (!this.product_color_id) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Seleccione un color.'`});
      return;        
    }
    if (!this.stock) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Ingresa la cantidad del stock.'`});
      return;        
    }

    let data = {
      product_id: this.product_id,
      product_color_id: this.product_color_id,
      product_size_id: this.product_size_id,
      product_size_new: this.product_size_new,
      stock: this.stock
    }
    this._productService.addInventario(data).subscribe((resp:any) => {
      //chequear el uso del return;
      //console.log(resp);
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'${resp.message_error}'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent, {text: `primary-'Configuración Actualizada.'`});
        this.product_color_id = null;
        this.product_size_id = null;
        this.product_size_new = null;
        this.stock = null;
        let INDEX = this.product_inventario.findIndex(item => item.id == resp.product_color_size.id);
        if (INDEX != -1) {
          //si creo nueva data INDEX != -1 se refiere a que no existe y solo queda editarlo.
          this.product_inventario[INDEX] = resp.product_color_size;
        }else{
          //Aquí carga de forma interna con push sin recargar la página.
          this.product_inventario.push(resp.product_color_size);
        }        
      }
    });
  }

}
