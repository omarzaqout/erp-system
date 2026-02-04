import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, Warehouse } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private _products = new BehaviorSubject<Product[]>([
    {
      id: '1',
      sku: 'PROD-001',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with USB receiver',
      category: 'Electronics',
      price: 29.99,
      cost: 15.00,
      quantity: 150,
      minStock: 20,
      status: 'in_stock',
      warehouse: 'Main Warehouse'
    },
    {
      id: '2',
      sku: 'PROD-002',
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      category: 'Electronics',
      price: 89.99,
      cost: 45.00,
      quantity: 75,
      minStock: 15,
      status: 'in_stock',
      warehouse: 'Main Warehouse'
    },
    {
      id: '3',
      sku: 'PROD-003',
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and card reader',
      category: 'Electronics',
      price: 49.99,
      cost: 25.00,
      quantity: 12,
      minStock: 10,
      status: 'low_stock',
      warehouse: 'Secondary Warehouse'
    },
    {
      id: '4',
      sku: 'PROD-004',
      name: 'Webcam 4K',
      description: '4K webcam with autofocus and noise reduction',
      category: 'Electronics',
      price: 129.99,
      cost: 70.00,
      quantity: 0,
      minStock: 5,
      status: 'out_of_stock',
      warehouse: 'Main Warehouse'
    },
    {
      id: '5',
      sku: 'PROD-005',
      name: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand',
      category: 'Accessories',
      price: 39.99,
      cost: 18.00,
      quantity: 200,
      minStock: 25,
      status: 'in_stock',
      warehouse: 'Secondary Warehouse'
    }
  ]);

  private _warehouses = new BehaviorSubject<Warehouse[]>([
    {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH-001',
      address: '1000 Warehouse Blvd, Industrial Park, NY 10001',
      manager: 'Mike Johnson',
      phone: '+1 555-0501',
      capacity: 10000,
      usedCapacity: 6500,
      status: 'active'
    },
    {
      id: '2',
      name: 'Secondary Warehouse',
      code: 'WH-002',
      address: '2000 Storage Lane, Distribution Center, NJ 07030',
      manager: 'Sarah Davis',
      phone: '+1 555-0502',
      capacity: 5000,
      usedCapacity: 2800,
      status: 'active'
    },
    {
      id: '3',
      name: 'West Coast Warehouse',
      code: 'WH-003',
      address: '3000 Logistics Way, Port of LA, CA 90731',
      manager: 'Tom Wilson',
      phone: '+1 555-0503',
      capacity: 8000,
      usedCapacity: 0,
      status: 'inactive'
    }
  ]);

  constructor(private notificationService: NotificationService) {}

  get products$(): Observable<Product[]> {
    return this._products.asObservable();
  }

  get warehouses$(): Observable<Warehouse[]> {
    return this._warehouses.asObservable();
  }

  updateStock(productId: string, quantityChange: number) {
    const products = this._products.value;
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
      const updatedProducts = [...products];
      const product = { ...updatedProducts[index] };
      const oldStatus = product.status;
      
      product.quantity += quantityChange;
      
      // Update status based on quantity
      if (product.quantity <= 0) {
        product.quantity = 0;
        product.status = 'out_of_stock';
      } else if (product.quantity <= product.minStock) {
        product.status = 'low_stock';
      } else {
        product.status = 'in_stock';
      }
      
      // Notify if status changed to low_stock or out_of_stock
      if (product.status !== oldStatus && (product.status === 'low_stock' || product.status === 'out_of_stock')) {
        this.notificationService.addNotification({
          title: 'Stock Alert',
          message: `Product "${product.name}" is now ${product.status.replace('_', ' ')} (Remaining: ${product.quantity})`,
          type: product.status === 'out_of_stock' ? 'error' : 'warning',
          read: false
        });
      }

      updatedProducts[index] = product;
      this._products.next(updatedProducts);
    }
  }

  getProductById(id: string): Product | undefined {
    return this._products.value.find(p => p.id === id);
  }
}
