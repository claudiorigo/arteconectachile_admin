import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductsService } from '../_services/products.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent implements OnInit {

  isLoading$: any;  
  name: any = null;//--- star data:Form ---
  sku: any = null;
  description_short: any = null;
  description: any = null;
  price_pesos: any = '';
  price_usd: any = '';
  //state: any = null;
  image_file: any = null;
  //product_stock: any = null;
  tags: any = [];
  categorie_id: any = '';//--- end data:Form ---
  image_preview: any = 'assets/media/default/default_small.jpg';
  text: any = null;
  images_files: any = null;
  images_previews: any = null;
  images_files_array: any = [];
  categorias: any = [];

  constructor(public _productService: ProductsService, public toaster: Toaster, ) { }

  ngOnInit(): void {    
    this.isLoading$ = this._productService.isLoading$;
    this._productService.getCategories().subscribe((resp:any) => {
      this.categorias = resp.categorias;
    })
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false)
    }, 50);
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
    this.images_files_array.push({
      file: this.images_files,
      show: this.images_previews,
    });
    this.images_files = null;
    this.images_previews = null;
  }

  removeImages(index){
    this.images_files_array.splice(index, 1);
  }

  createProduct(){   
    if (! this.name || ! this.sku || ! this.description_short || ! this.description || ! this.price_pesos || ! this.price_usd || ! this.image_file || ! this.tags || ! this.categorie_id) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Todos los campos son obligatorios'`});
      return;
    }

    if (this.images_files_array.length == 0) {
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Agregar grupo de imagenes'`});
      return;
    }

    let formDate = new FormData();
    formDate.append('name', this.name);
    formDate.append('sku', this.sku);
    formDate.append('description_short', this.description_short);
    formDate.append('description', this.description);
    formDate.append('price_pesos', this.price_pesos);
    formDate.append('price_usd', this.price_usd);
    formDate.append('image_file', this.image_file);
    formDate.append('tags', this.tags);
    //formDate.append('stock', this.product_stock);
    formDate.append('categorie_id', this.categorie_id);

    let index = 0;
    for (const image_file_array of this.images_files_array) {
      formDate.append('files[' + index + ']', image_file_array.file);
      index++;
    }
    //console.log(formDate);
    this._productService.createProduct(formDate).subscribe((resp:any) => {
      //console.log(resp);
      if(resp.message == 200){
        this.toaster.open(NoticyAlertComponent, {text: `primary-'Producto creado exitosamente.'`});
        this.name = null;
        this.sku = null;
        this.description_short = null;
        this.description = null;
        this.price_pesos = null;
        this.price_usd = null;
        this.image_file = null;
        this.tags = [];
        this.categorie_id = null;
        this.images_files_array = [];
        this.image_file = null;
        this.image_preview = this.image_preview;
        //return;
      }
      if (resp.message == 403) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'Producto ya existe'`});
        return;
      }
    })
  }
}
