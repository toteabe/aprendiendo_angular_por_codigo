import { inject, Injectable } from '@angular/core';
import { APP_SETTINGS } from './app.settings';
import { HttpClient } from '@angular/common/http';
import { Cart } from './cart';
import { Observable, from, map, mergeMap, toArray } from 'rxjs';
import { Product } from './product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient: HttpClient) { }

  private cartsUrl = inject(APP_SETTINGS).apiUrl + '/carts';
  private productsUrl = inject(APP_SETTINGS).apiUrl + '/products';

  updateProdDescr(cart: Cart) : Observable<CartItem[]> {

    return from(cart.products)
              .pipe(
                mergeMap( p => this.httpClient.get<Product>(this.productsUrl+'/'+p.productId)
                                                .pipe(
                                                      map(pApi => {
                                                                        const cartItem: CartItem = {
                                                                        productId: p.productId,
                                                                        quantity: p.quantity,
                                                                        descr: pApi.title
                                                                      };
                                                                      return cartItem;
                                                                   }
                                                          )
                                                     )
                         ),
                toArray()
              );

  }

  getAll(userId?: number): Observable<Cart[]> {

    if (userId) {
      return this.httpClient.get<Cart[]>(this.cartsUrl+'/'+userId);
    } else {
      return this.httpClient.get<Cart[]>(this.cartsUrl);
    }

  }

  create(userId: number): Observable<Cart> {

    const fecha = new Date();
    const yyyymmdd = fecha.toISOString().split('T')[0];
    const newCart: Cart = { userId, date: yyyymmdd, products: []};

    return this.httpClient.post<Cart>(this.cartsUrl, newCart );

  }

}
