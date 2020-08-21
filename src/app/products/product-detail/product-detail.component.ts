import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  delete() {
    if(window.confirm("Are you sure ?")) {
      this
      .productService
      .deleteProduct(this.product.id)
      .subscribe(
        () => {
          console.log("Product deleted!");
          this.productService.initProducts();
          this.router.navigateByUrl("/products");
        },
        error => console.error("Could not delete product! " + error.message)
      )
    }
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params["id"];
    this
      .productService
      .products$
      .pipe(
        map(products => products.find(p => p.id == id))
      )
      .subscribe(
        result => this.product = result
      )
  }

}
