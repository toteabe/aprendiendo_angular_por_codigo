import { Component, OnInit } from '@angular/core';
import * as forms from '@angular/forms';
import { CartService } from '../cart.service';
import { Cart } from '../cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [forms.FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  userId: string = '1';
  carts: Cart[] = [];

  selectedCart?: Cart;
  loading: boolean = false;

  constructor(private readonly cartService: CartService){}

  ngOnInit(): void {

    this.cartService.getAll().subscribe(carts => {

      this.carts = carts;

    });

  }

  onSelectCart(cartId: number): void {

    this.loading = true;
    const cartAux = this.carts.filter( c => c.id === cartId)[0];

    this.cartService.updateProdDescr(cartAux).subscribe( products => {

        cartAux.products = products;
        this.selectedCart = cartAux;
        this.loading = false;

    });
  }

  onCreate(): void {

    this.cartService.create(+this.userId).subscribe(cart => {

      const idx = this.carts.findIndex( c => c.id === cart.id);
//ELIMINAR {
      if (idx > -1) {

        //La API siempre devuelve cart.id=11¿? luego puede que ya este se limpia y recarga
        this.carts[idx]= cart;
        this.carts=[...this.carts];

      } else {
//} FIN ELIMINAR
        this.carts = [...this.carts, cart];
      }

    });

  }


}
