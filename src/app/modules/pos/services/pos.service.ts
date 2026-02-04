import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InventoryService } from '../../inventory/services/inventory.service';
import { Product as InventoryProduct } from '../../../core/services/mock-data.service';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    sku?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class PosService {
    private _cart = new BehaviorSubject<CartItem[]>([]);
    private _scannerState = new BehaviorSubject<'idle' | 'scanning' | 'success' | 'error'>('idle');
    
    public scannerState$ = this._scannerState.asObservable();
    
    // Map Inventory products to POS products
    products$: Observable<Product[]> = this.inventoryService.products$.pipe(
        map(invProducts => invProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: `assets/images/${p.name.toLowerCase().replace(' ', '-')}.png`,
            sku: p.sku
        })))
    );

    constructor(private inventoryService: InventoryService) {}

    get cart$(): Observable<CartItem[]> {
        return this._cart.asObservable();
    }

    get total$(): Observable<number> {
        return this.cart$.pipe(
            map(items => items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0))
        );
    }

    addToCart(product: Product) {
        const currentCart = this._cart.value;
        const existingItem = currentCart.find(item => item.product.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
            this._cart.next([...currentCart]);
        } else {
            this._cart.next([...currentCart, { product, quantity: 1 }]);
        }
    }

    removeFromCart(productId: string) {
        const currentCart = this._cart.value;
        this._cart.next(currentCart.filter(item => item.product.id !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const currentCart = this._cart.value;
        const item = currentCart.find(i => i.product.id === productId);
        if (item) {
            item.quantity = quantity;
            this._cart.next([...currentCart]);
        }
    }

    setScannerState(state: 'idle' | 'scanning' | 'success' | 'error') {
        this._scannerState.next(state);
        // Auto-reset to idle after a delay if it was success/error/scanning
        if (state !== 'idle') {
            setTimeout(() => this._scannerState.next('idle'), state === 'scanning' ? 1000 : 2000);
        }
    }

    scanProduct(barcode: string): boolean {
        let found = false;
        this.inventoryService.products$.pipe(
            map(products => products.find(p => p.sku === barcode))
        ).subscribe(invProduct => {
            if (invProduct) {
                this.addToCart({
                    id: invProduct.id,
                    name: invProduct.name,
                    price: invProduct.price,
                    category: invProduct.category,
                    image: `assets/images/${invProduct.name.toLowerCase().replace(' ', '-')}.png`,
                    sku: invProduct.sku
                });
                this.setScannerState('success');
                found = true;
            } else {
                this.setScannerState('error');
            }
        }).unsubscribe();
        
        return found;
    }

    clearCart() {
        this._cart.next([]);
    }

    refreshCart() {
        this._cart.next([...this._cart.value]);
    }
}
