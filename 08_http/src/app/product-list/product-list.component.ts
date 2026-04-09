import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { SortPipe } from '../sort.pipe';
import { ProductsService } from '../products.service';
import { ProductCreateComponent } from '../product-create/product-create.component';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductDetailComponent,
    SortPipe,
    AsyncPipe,
    ProductCreateComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products$: Observable<Product[]> | undefined;
  selectedProduct: Product | undefined;
  productsComp: Product[] = [];
  
  //Inyección por constructor del productService disponible en el contexto de angular
  constructor(private productService: ProductsService) {}
  
  onAdded() {
    alert(`${this.selectedProduct?.title} added to the cart!`);
  }

  //hook/enganche del ciclo vida de los componentes
  ngOnInit(): void {
    //para carga inicial de datos
    this.getProducts();
  }

  private getProducts() {
    this.products$ = this.productService.getProducts();

    //             este subscribe es el consumidor del observable
    this.products$.subscribe( (products: Product[]) =>{
      this.productsComp = products;
    });
  }
}
