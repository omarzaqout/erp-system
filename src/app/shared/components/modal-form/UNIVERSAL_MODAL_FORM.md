# Universal Modal Form - Usage Guide

## Overview
The Universal Modal Form provides a consistent, beautiful design for all "New" actions (New Order, New Customer, etc.) across your ERP system. It combines the modal and form components into a single, easy-to-use solution.

## Features

✨ **Consistent Design** - Same beautiful design for all modals
🎨 **Gradient Header** - Eye-catching header with icon support
📱 **Responsive** - Works on all screen sizes
✅ **Built-in Validation** - Form validation with error messages
🔄 **Form State Management** - Automatic form validity tracking
🎯 **Easy to Use** - Simple API with pre-configured templates

## Basic Usage

### 1. Import Required Types

```typescript
import { ModalService } from '../../../shared/services/modal.service';
import { ModalFormConfig } from '../../../shared/components/modal-form/modal-form.component';
import { FormConfig } from '../../../shared/components/shared-form/shared-form.component';
```

### 2. Define Your Form Configuration

```typescript
const formConfig: FormConfig = {
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true
    }
  ],
  layout: 'two-column',
  submitLabel: 'Create',
  cancelLabel: 'Cancel'
};
```

### 3. Open the Modal Form

```typescript
onAddNew() {
  const modalFormConfig: ModalFormConfig = {
    title: 'Create New Item',
    icon: 'fas fa-plus-circle', // Optional icon
    size: 'lg',
    formConfig: formConfig,
    onSubmit: (data: any) => {
      // Handle form submission
      this.createItem(data);
    },
    onCancel: () => {
      // Handle cancellation
      console.log('Cancelled');
    }
  };

  this.modalService.openForm(modalFormConfig);
}
```

## Using Pre-configured Templates

We provide pre-configured form templates for common entities:

```typescript
import { 
  OrderFormConfig, 
  CustomerFormConfig, 
  ProductFormConfig, 
  EmployeeFormConfig 
} from '../../../shared/configs/form-configs';

// Use pre-configured template
onAddNew() {
  const modalFormConfig: ModalFormConfig = {
    title: 'Create New Order',
    icon: 'fas fa-shopping-cart',
    size: 'lg',
    formConfig: OrderFormConfig, // Use pre-configured template
    onSubmit: (data: any) => {
      this.createOrder(data);
    }
  };

  this.modalService.openForm(modalFormConfig);
}
```

## Customizing Pre-configured Templates

You can customize pre-configured templates:

```typescript
import { OrderFormConfig } from '../../../shared/configs/form-configs';

onAddNew() {
  // Clone and customize
  const customFormConfig = {
    ...OrderFormConfig,
    fields: [
      ...OrderFormConfig.fields,
      {
        key: 'customField',
        label: 'Custom Field',
        type: 'text'
      }
    ]
  };

  const modalFormConfig: ModalFormConfig = {
    title: 'Create New Order',
    icon: 'fas fa-shopping-cart',
    size: 'lg',
    formConfig: customFormConfig,
    onSubmit: (data: any) => {
      this.createOrder(data);
    }
  };

  this.modalService.openForm(modalFormConfig);
}
```

## Available Icons

Use Font Awesome icons for the header:

- `fas fa-shopping-cart` - Orders
- `fas fa-user-plus` - Customers
- `fas fa-box` - Products
- `fas fa-user-tie` - Employees
- `fas fa-file-invoice` - Invoices
- `fas fa-truck` - Purchase Orders
- `fas fa-plus-circle` - Generic Add

## Modal Sizes

- `sm` - Small (400px)
- `md` - Medium (600px) - Default
- `lg` - Large (800px) - Recommended for forms
- `xl` - Extra Large (1200px)

## Complete Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { ModalFormConfig } from '../../../shared/components/modal-form/modal-form.component';
import { CustomerFormConfig } from '../../../shared/configs/form-configs';

export class CustomersComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  onAddNew() {
    const modalFormConfig: ModalFormConfig = {
      title: 'Create New Customer',
      icon: 'fas fa-user-plus',
      size: 'lg',
      formConfig: CustomerFormConfig,
      initialData: null, // Optional: pre-fill form data
      onSubmit: (data: any) => {
        console.log('Form data:', data);
        // Create customer logic
        this.createCustomer(data);
      },
      onCancel: () => {
        console.log('Creation cancelled');
      }
    };

    this.modalService.openForm(modalFormConfig);
  }

  createCustomer(data: any) {
    // Your create logic here
    // After successful creation, the modal will close automatically
  }
}
```

## Design Features

### Header
- Gradient background (blue theme)
- Icon support with circular background
- Title with consistent typography
- Close button with hover animation

### Body
- Light background for better contrast
- Scrollable content area
- Responsive form layout
- Consistent spacing and padding

### Footer
- Fixed footer with action buttons
- Primary action button (Save/Create)
- Secondary action button (Cancel)
- Loading state support
- Disabled state when form is invalid

## Best Practices

1. **Use Pre-configured Templates** - Start with pre-configured templates and customize as needed
2. **Consistent Icons** - Use appropriate icons for each entity type
3. **Proper Validation** - Always add validation to required fields
4. **Error Handling** - Handle form submission errors gracefully
5. **User Feedback** - Show success/error messages after submission

## Form Configuration Reference

See `SHARED_FORM_USAGE.md` for detailed form field configuration options.
