import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth';
import { finalize } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(private http: HttpClient, public authservice: AuthService,) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  
  allCoupons(page=1, search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});
    let LINK = '';
    if (search) {
      LINK = '&search=' + search;
    }
    let URL = URL_SERVICIOS + '/cupones/listar?page=' + page + LINK;
    return this.http.get(URL, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  allCategoriesProducts(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});    
    let URL = URL_SERVICIOS + '/cupones/listar-categorias-productos';
    return this.http.get(URL, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  createCoupon(data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS + '/cupones/crear';
    return this.http.post(URL, data, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  updateCoupon(coupon_id:any, data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS + '/cupones/actualizar/' + coupon_id;
    return this.http.put(URL, data, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteCoupon(coupon_id:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS + '/cupones/eliminar/' + coupon_id;
    return this.http.delete(URL, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showCoupon(coupon_id:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS + '/cupones/ver/' + coupon_id;
    return this.http.get(URL, {headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
