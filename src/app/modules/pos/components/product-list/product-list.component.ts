import { Component, OnInit } from '@angular/core';
import { PosService, Product } from '../../services/pos.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  categories$: Observable<string[]>;
  scannerState$: Observable<string>;
  
  private searchQuery = new BehaviorSubject<string>('');
  private selectedCategory = new BehaviorSubject<string>('All');

  constructor(private posService: PosService) {
    this.scannerState$ = this.posService.scannerState$;
    this.categories$ = this.posService.products$.pipe(
      map(products => {
        const cats = products.map(p => p.category);
        return ['All', ...new Set(cats)];
      })
    );

    this.products$ = combineLatest([
      this.posService.products$,
      this.searchQuery,
      this.selectedCategory
    ]).pipe(
      map(([products, query, category]) => {
        return products.filter(p => {
          const matchQuery = p.name.toLowerCase().includes(query.toLowerCase()) || 
                             (p.sku && p.sku.includes(query));
          const matchCategory = category === 'All' || p.category === category;
          return matchQuery && matchCategory;
        });
      })
    );
  }

  ngOnInit(): void { }

  addToCart(product: Product) {
    this.posService.addToCart(product);
  }

  onSearch(event: any) {
    this.searchQuery.next(event.target.value);
  }

  selectCategory(cat: string) {
    this.selectedCategory.next(cat);
  }

  get currentCategory() {
    return this.selectedCategory.value;
  }
}
