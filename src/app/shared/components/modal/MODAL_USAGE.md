# Universal Modal Component - Usage Guide

## Overview
The universal modal component can be used throughout the application for creating, editing, or displaying content in a modal dialog.

## Basic Usage

### 1. Import the ModalService

```typescript
import { ModalService } from '../../../shared/services/modal.service';

constructor(private modalService: ModalService) {}
```

### 2. Open a Simple Modal

```typescript
onAddNew() {
  this.modalService.open({
    title: 'Create New Item',
    size: 'md', // 'sm' | 'md' | 'lg' | 'xl'
    body: 'This is a simple modal with text content.',
    buttons: [
      {
        label: 'Cancel',
        class: 'btn-secondary',
        action: () => {
          console.log('Cancel clicked');
        }
      },
      {
        label: 'Save',
        class: 'btn-primary',
        action: () => {
          console.log('Save clicked');
          // Your save logic here
        }
      }
    ]
  });
}
```

### 3. Modal with HTML Content

```typescript
onAddNew() {
  this.modalService.open({
    title: 'Create New Order',
    size: 'lg',
    body: `
      <div class="alert alert-info">
        <strong>Note:</strong> This is HTML content in the modal.
      </div>
      <p>You can include any HTML content here.</p>
    `,
    buttons: [
      {
        label: 'Close',
        class: 'btn-secondary',
        action: () => {}
      }
    ]
  });
}
```

### 4. Modal Configuration Options

```typescript
interface ModalConfig {
  title: string;                    // Required: Modal title
  body?: string;                     // Optional: HTML content as string
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Optional: Modal size (default: 'md')
  showClose?: boolean;               // Optional: Show close button (default: true)
  closeOnBackdrop?: boolean;        // Optional: Close on backdrop click (default: true)
  buttons?: ModalButton[];           // Optional: Action buttons
}

interface ModalButton {
  label: string;                     // Button text
  class?: string;                    // CSS classes (default: 'btn-secondary')
  action: () => void;                // Click handler
  closeOnClick?: boolean;            // Close modal after click (default: true)
}
```

## Examples

### Example 1: Create Order Modal
```typescript
onAddNew() {
  this.modalService.open({
    title: 'Create New Order',
    size: 'lg',
    body: 'Order creation form...',
    buttons: [
      {
        label: 'Cancel',
        class: 'btn-secondary',
        action: () => console.log('Cancelled')
      },
      {
        label: 'Create Order',
        class: 'btn-primary',
        action: () => {
          // Create order logic
          this.createOrder();
        }
      }
    ]
  });
}
```

### Example 2: Confirmation Modal
```typescript
confirmDelete(item: any) {
  this.modalService.open({
    title: 'Confirm Delete',
    size: 'sm',
    body: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    buttons: [
      {
        label: 'Cancel',
        class: 'btn-secondary',
        action: () => {}
      },
      {
        label: 'Delete',
        class: 'btn-danger',
        action: () => {
          this.deleteItem(item.id);
        }
      }
    ]
  });
}
```

### Example 3: View Details Modal
```typescript
viewDetails(item: any) {
  this.modalService.open({
    title: 'Item Details',
    size: 'lg',
    body: `
      <div class="row">
        <div class="col-md-6">
          <strong>Name:</strong> ${item.name}
        </div>
        <div class="col-md-6">
          <strong>Status:</strong> ${item.status}
        </div>
      </div>
    `,
    buttons: [
      {
        label: 'Close',
        class: 'btn-primary',
        action: () => {}
      }
    ]
  });
}
```

## Closing the Modal

The modal can be closed by:
1. Clicking the close button (X)
2. Clicking the backdrop (if `closeOnBackdrop` is true)
3. Clicking a button with `closeOnClick: true` (default)
4. Programmatically: `this.modalService.close()`

## Notes

- The modal component is already included in `app.component.ts`, so it's available globally
- The modal service is provided in root, so it can be injected anywhere
- Use appropriate sizes: 'sm' for confirmations, 'md' for forms, 'lg' for detailed views, 'xl' for complex forms
- For complex forms, consider creating dedicated form components and using them with ng-content projection
