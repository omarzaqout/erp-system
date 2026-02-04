import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  value: number;
  assignedTo: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  warehouse: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  orderDate: Date;
  deliveryDate?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  orderId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDate: Date;
  receivedDate?: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: Date;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated';
  avatar?: string;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  date: Date;
  reference?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  phone: string;
  capacity: number;
  usedCapacity: number;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  // Mock Customers
  private customers: Customer[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 555-0101',
      company: 'Acme Corp',
      address: '123 Business St, New York, NY 10001',
      status: 'active',
      totalOrders: 45,
      totalSpent: 125000,
      createdAt: new Date('2022-01-15')
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'info@techstart.com',
      phone: '+1 555-0102',
      company: 'TechStart',
      address: '456 Innovation Ave, San Francisco, CA 94105',
      status: 'active',
      totalOrders: 28,
      totalSpent: 78000,
      createdAt: new Date('2022-03-20')
    },
    {
      id: '3',
      name: 'Global Solutions Ltd',
      email: 'hello@globalsolutions.com',
      phone: '+1 555-0103',
      company: 'Global Solutions',
      address: '789 Enterprise Blvd, Chicago, IL 60601',
      status: 'inactive',
      totalOrders: 12,
      totalSpent: 34000,
      createdAt: new Date('2022-06-10')
    },
    {
      id: '4',
      name: 'Smart Retail Co',
      email: 'support@smartretail.com',
      phone: '+1 555-0104',
      company: 'Smart Retail',
      address: '321 Commerce Way, Miami, FL 33101',
      status: 'active',
      totalOrders: 67,
      totalSpent: 198000,
      createdAt: new Date('2022-08-05')
    },
    {
      id: '5',
      name: 'Digital Dynamics',
      email: 'contact@digitaldyn.com',
      phone: '+1 555-0105',
      company: 'Digital Dynamics',
      address: '654 Tech Park, Austin, TX 78701',
      status: 'active',
      totalOrders: 34,
      totalSpent: 92000,
      createdAt: new Date('2023-01-12')
    }
  ];

  // Mock Leads
  private leads: Lead[] = [
    {
      id: '1',
      name: 'Michael Chen',
      email: 'm.chen@prospects.com',
      phone: '+1 555-0201',
      company: 'Prospect Industries',
      source: 'Website',
      status: 'qualified',
      value: 50000,
      assignedTo: 'Jane Smith',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 's.williams@leads.com',
      phone: '+1 555-0202',
      company: 'Lead Generation Co',
      source: 'Referral',
      status: 'proposal',
      value: 75000,
      assignedTo: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '3',
      name: 'David Brown',
      email: 'd.brown@opportunities.com',
      phone: '+1 555-0203',
      company: 'Opportunity Corp',
      source: 'Trade Show',
      status: 'negotiation',
      value: 120000,
      assignedTo: 'Jane Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'e.davis@potential.com',
      phone: '+1 555-0204',
      company: 'Potential Partners',
      source: 'LinkedIn',
      status: 'new',
      value: 35000,
      assignedTo: 'Bob Johnson',
      createdAt: new Date('2024-01-25')
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'r.wilson@future.com',
      phone: '+1 555-0205',
      company: 'Future Enterprises',
      source: 'Email Campaign',
      status: 'contacted',
      value: 60000,
      assignedTo: 'John Doe',
      createdAt: new Date('2024-01-28')
    }
  ];

  // Mock Products
  private products: Product[] = [
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
      quantity: 8,
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
  ];

  // Mock Orders
  private orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerId: '1',
      customerName: 'Acme Corporation',
      items: [
        { productId: '1', productName: 'Wireless Mouse', quantity: 10, price: 29.99, total: 299.90 },
        { productId: '2', productName: 'Mechanical Keyboard', quantity: 5, price: 89.99, total: 449.95 }
      ],
      subtotal: 749.85,
      tax: 62.49,
      total: 812.34,
      status: 'delivered',
      paymentStatus: 'paid',
      orderDate: new Date('2024-01-15'),
      deliveryDate: new Date('2024-01-18')
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerId: '2',
      customerName: 'TechStart Inc',
      items: [
        { productId: '3', productName: 'USB-C Hub', quantity: 20, price: 49.99, total: 999.80 }
      ],
      subtotal: 999.80,
      tax: 83.32,
      total: 1083.12,
      status: 'processing',
      paymentStatus: 'paid',
      orderDate: new Date('2024-01-20')
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerId: '4',
      customerName: 'Smart Retail Co',
      items: [
        { productId: '5', productName: 'Laptop Stand', quantity: 50, price: 39.99, total: 1999.50 },
        { productId: '1', productName: 'Wireless Mouse', quantity: 30, price: 29.99, total: 899.70 }
      ],
      subtotal: 2899.20,
      tax: 241.60,
      total: 3140.80,
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: new Date('2024-01-25')
    }
  ];

  // Mock Invoices
  private invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerId: '1',
      customerName: 'Acme Corporation',
      orderId: '1',
      amount: 749.85,
      tax: 62.49,
      total: 812.34,
      status: 'paid',
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      paidDate: new Date('2024-01-16')
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerId: '2',
      customerName: 'TechStart Inc',
      orderId: '2',
      amount: 999.80,
      tax: 83.32,
      total: 1083.12,
      status: 'paid',
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      paidDate: new Date('2024-01-21')
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerId: '4',
      customerName: 'Smart Retail Co',
      orderId: '3',
      amount: 2899.20,
      tax: 241.60,
      total: 3140.80,
      status: 'sent',
      issueDate: new Date('2024-01-25'),
      dueDate: new Date('2024-02-25')
    }
  ];

  // Mock Vendors
  private vendors: Vendor[] = [
    {
      id: '1',
      name: 'Tech Supplies Co',
      email: 'orders@techsupplies.com',
      phone: '+1 555-0301',
      address: '100 Supplier Way, Los Angeles, CA 90001',
      category: 'Electronics',
      status: 'active',
      totalPurchases: 15
    },
    {
      id: '2',
      name: 'Office Depot Wholesale',
      email: 'wholesale@officedepot.com',
      phone: '+1 555-0302',
      address: '200 Distribution Center, Dallas, TX 75201',
      category: 'Office Supplies',
      status: 'active',
      totalPurchases: 28
    },
    {
      id: '3',
      name: 'Global Imports Ltd',
      email: 'sales@globalimports.com',
      phone: '+1 555-0303',
      address: '300 Import Street, Seattle, WA 98101',
      category: 'General',
      status: 'inactive',
      totalPurchases: 8
    }
  ];

  // Mock Purchase Orders
  private purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      vendorId: '1',
      vendorName: 'Tech Supplies Co',
      items: [
        { productId: '1', productName: 'Wireless Mouse', quantity: 100, unitPrice: 12.00, total: 1200.00 },
        { productId: '2', productName: 'Mechanical Keyboard', quantity: 50, unitPrice: 35.00, total: 1750.00 }
      ],
      subtotal: 2950.00,
      tax: 246.25,
      total: 3196.25,
      status: 'received',
      orderDate: new Date('2024-01-05'),
      expectedDate: new Date('2024-01-15'),
      receivedDate: new Date('2024-01-14')
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      vendorId: '2',
      vendorName: 'Office Depot Wholesale',
      items: [
        { productId: '5', productName: 'Laptop Stand', quantity: 200, unitPrice: 14.00, total: 2800.00 }
      ],
      subtotal: 2800.00,
      tax: 233.33,
      total: 3033.33,
      status: 'approved',
      orderDate: new Date('2024-01-22'),
      expectedDate: new Date('2024-02-05')
    }
  ];

  // Mock Employees
  private employees: Employee[] = [
    {
      id: '1',
      employeeId: 'EMP-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 555-0401',
      department: 'IT',
      position: 'System Administrator',
      joinDate: new Date('2020-01-15'),
      salary: 85000,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0070C0&color=fff'
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 555-0402',
      department: 'Sales',
      position: 'Sales Manager',
      joinDate: new Date('2020-03-20'),
      salary: 95000,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=28A745&color=fff'
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@company.com',
      phone: '+1 555-0403',
      department: 'Finance',
      position: 'Accountant',
      joinDate: new Date('2021-06-10'),
      salary: 70000,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=FF6B35&color=fff'
    },
    {
      id: '4',
      employeeId: 'EMP-004',
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@company.com',
      phone: '+1 555-0404',
      department: 'HR',
      position: 'HR Manager',
      joinDate: new Date('2021-09-15'),
      salary: 80000,
      status: 'on_leave',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Williams&background=9C27B0&color=fff'
    },
    {
      id: '5',
      employeeId: 'EMP-005',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@company.com',
      phone: '+1 555-0405',
      department: 'Operations',
      position: 'Operations Manager',
      joinDate: new Date('2022-02-01'),
      salary: 75000,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=FFC107&color=333'
    }
  ];

  // Mock Transactions
  private transactions: Transaction[] = [
    {
      id: '1',
      transactionNumber: 'TRX-2024-001',
      type: 'income',
      category: 'Sales',
      amount: 812.34,
      description: 'Payment from Acme Corporation',
      date: new Date('2024-01-16'),
      reference: 'INV-2024-001',
      status: 'completed'
    },
    {
      id: '2',
      transactionNumber: 'TRX-2024-002',
      type: 'income',
      category: 'Sales',
      amount: 1083.12,
      description: 'Payment from TechStart Inc',
      date: new Date('2024-01-21'),
      reference: 'INV-2024-002',
      status: 'completed'
    },
    {
      id: '3',
      transactionNumber: 'TRX-2024-003',
      type: 'expense',
      category: 'Purchases',
      amount: 3196.25,
      description: 'Purchase from Tech Supplies Co',
      date: new Date('2024-01-14'),
      reference: 'PO-2024-001',
      status: 'completed'
    },
    {
      id: '4',
      transactionNumber: 'TRX-2024-004',
      type: 'expense',
      category: 'Salaries',
      amount: 25000.00,
      description: 'Monthly Payroll',
      date: new Date('2024-01-31'),
      status: 'completed'
    },
    {
      id: '5',
      transactionNumber: 'TRX-2024-005',
      type: 'expense',
      category: 'Utilities',
      amount: 1250.00,
      description: 'Office Utilities',
      date: new Date('2024-01-25'),
      status: 'completed'
    }
  ];

  // Mock Warehouses
  private warehouses: Warehouse[] = [
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
  ];

  constructor() { }

  // Customer Methods
  getCustomers(): Observable<Customer[]> {
    return of(this.customers);
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    return of(this.customers.find(c => c.id === id));
  }

  // Lead Methods
  getLeads(): Observable<Lead[]> {
    return of(this.leads);
  }

  getLeadById(id: string): Observable<Lead | undefined> {
    return of(this.leads.find(l => l.id === id));
  }

  // Product Methods
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  // Order Methods
  getOrders(): Observable<Order[]> {
    return of(this.orders);
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return of(this.orders.find(o => o.id === id));
  }

  // Invoice Methods
  getInvoices(): Observable<Invoice[]> {
    return of(this.invoices);
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return of(this.invoices.find(i => i.id === id));
  }

  // Vendor Methods
  getVendors(): Observable<Vendor[]> {
    return of(this.vendors);
  }

  getVendorById(id: string): Observable<Vendor | undefined> {
    return of(this.vendors.find(v => v.id === id));
  }

  // Purchase Order Methods
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return of(this.purchaseOrders);
  }

  getPurchaseOrderById(id: string): Observable<PurchaseOrder | undefined> {
    return of(this.purchaseOrders.find(po => po.id === id));
  }

  // Employee Methods
  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    return of(this.employees.find(e => e.id === id));
  }

  // Transaction Methods
  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions);
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    return of(this.transactions.find(t => t.id === id));
  }

  // Warehouse Methods
  getWarehouses(): Observable<Warehouse[]> {
    return of(this.warehouses);
  }

  getWarehouseById(id: string): Observable<Warehouse | undefined> {
    return of(this.warehouses.find(w => w.id === id));
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    const totalRevenue = this.invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0);
    
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalOrders = this.orders.length;
    const totalCustomers = this.customers.filter(c => c.status === 'active').length;
    const lowStockProducts = this.products.filter(p => p.status === 'low_stock').length;
    const pendingOrders = this.orders.filter(o => o.status === 'pending').length;

    return of({
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      totalOrders,
      totalCustomers,
      lowStockProducts,
      pendingOrders
    });
  }
}
