import { Component, OnInit } from '@angular/core';
import { Product } from './../product.interface';
import { ProductService } from "./../../services/product.service";
import { Observable, EMPTY } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  title: string = 'Products';
  products: Product[];
  products$: Observable<Product[]>;
  mostExpensiveProduct$: Observable<Product>;
  productsNumber$: Observable<number>;
  productsTotalNumber$ : Observable<number>;

  productsNumber: number = 0;
  selectedProduct: Product;
  errorMsg: string;

  // Pagination
  pageSize = 5;
  start = 0;
  end = this.pageSize;
  pageNumber = 1;
  productsToLoad = this.pageSize * 2;

  previousPage() {
    this.start -= this.pageSize;
    this.end -= this.pageSize;
    this.pageNumber--;
    this.selectedProduct = null;
  }

  nextPage() {
    this.start += this.pageSize;
    this.end += this.pageSize;
    this.pageNumber++;
    this.selectedProduct = null;
  }


  onSelect(product: Product) {
    this.selectedProduct = product;
    this.router.navigateByUrl("/products/" + product.id);
  }

  constructor(
    private productService: ProductService,
    private router: Router) {
  
  }

  loadMore() {
    let take = this.productsToLoad;
    let skip = this.end;

    this.productService.initProducts(skip, take);
  }

  ngOnInit(): void {
    this.products$ = this
                      .productService
                      .products$
                      .pipe(
                        catchError(
                          error => {
                            this.errorMsg = error;
                            return EMPTY;
                          }
                        )
                      );

    this.mostExpensiveProduct$ = this.productService.mostExpensiveProduct$;

    this.productsTotalNumber$ = this.productService.productsTotalNumber$;

    this.productsNumber$ = this
                              .products$
                              .pipe(
                                map(products => products.length),
                                //tap(nombre => this.productsNumber = nombre),
                                startWith(0)
                              );

    // this
    //   .productService
    //   .products$
    //   .subscribe(
    //     data => this.products = data
    //   );
  }

}
