import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from './product';
import { Observable, map, of, tap } from 'rxjs';
import { APP_SETTINGS } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  
  private products: Product[] = [];

  // inject(APP_SETTINGS).apiUrl == BASE_URL
  private productsUrl = inject(APP_SETTINGS).apiUrl + '/products';
  
  //inyección por constructor de httpClient, éste está disponible en el contexto de angular
  //cliente más potente que el fetch básico de JS standard que basa en Promise
  //angular utiliza este httpClient que basa en los Observables de RxJS más potentes 
  //que Promises 
  //private http: HttpClient = inject(HttpClient);
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    //HttpParams es un parámetro de URL (query param, lo que va detrás de ?)
    // http://localhost:3000/products?limit=10
    const params = new HttpParams().set('limit', 10);
    
    //httpClient - cliente de api sobre http para comunicar con la API o Backend
    //Envía una petición de verbo GET a la url de productsURL
    return this.http.get<Product[]>(this.productsUrl, {
      params: params
    }).pipe(
        map(products => {
          this.products = products;
          return products;
        })
    );
  }

  getProduct(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    return of(product!);
  }

  addProduct(newProduct: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, newProduct).pipe(
      map(product => {
        this.products.push(product);
        return product;
      })
    );
  }
  
  updateProduct(id: number, price: number): Observable<Product> {
    return this.http.patch<Product>(`${this.productsUrl}/${id}`, {
      price
    }).pipe(
      map(product => {
        const index = this.products.findIndex(p => p.id === id);
        this.products[index].price = price;
        return product;
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`).pipe(
      tap(() => {
        const index = this.products.findIndex(p => p.id === id);
        this.products.splice(index, 1);
      })
    );
  }  
  
}
