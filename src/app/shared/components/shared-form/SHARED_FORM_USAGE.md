# Shared Form Component - Usage Guide

## Overview
The shared form component is a reusable, configurable form that can be used in modals or anywhere in your application. It supports multiple field types, validation, and flexible layouts.

## Basic Usage

### 1. Import Required Types

```typescript
import { FormConfig, FormField } from '../../../shared/components/shared-form/shared-form.component';
```

### 2. Define Form Configuration

```typescript
const formConfig: FormConfig = {
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      required: true
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
      required: true
    }
  ],
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  layout: 'single' // or 'two-column' or 'three-column'
};
```

### 3. Use in Modal

```typescript
this.modalService.open({
  title: 'Create Item',
  size: 'lg',
  body: `<app-shared-form [config]='${JSON.stringify(formConfig)}'></app-shared-form>`,
  buttons: [
    {
      label: 'Cancel',
      class: 'btn-secondary',
      action: () => this.modalService.close()
    },
    {
      label: 'Save',
      class: 'btn-primary',
      action: () => {
        // Handle form submission
      }
    }
  ]
});
```

## Field Types

### Text Input
```typescript
{
  key: 'name',
  label: 'Name',
  type: 'text',
  placeholder: 'Enter name',
  required: true
}
```

### Email Input
```typescript
{
  key: 'email',
  label: 'Email',
  type: 'email',
  placeholder: 'Enter email',
  required: true
}
```

### Number Input
```typescript
{
  key: 'quantity',
  label: 'Quantity',
  type: 'number',
  placeholder: '0',
  required: true,
  validation: {
    min: 1,
    max: 1000
  }
}
```

### Currency Input
```typescript
{
  key: 'price',
  label: 'Price',
  type: 'currency',
  placeholder: '0.00',
  required: true,
  validation: {
    min: 0.01
  },
  step: 0.01
}
```

### Date Input
```typescript
{
  key: 'date',
  label: 'Date',
  type: 'date',
  required: true,
  defaultValue: new Date().toISOString().split('T')[0]
}
```

### Select Dropdown
```typescript
{
  key: 'status',
  label: 'Status',
  type: 'select',
  required: true,
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ],
  defaultValue: 'active'
}
```

### Textarea
```typescript
{
  key: 'description',
  label: 'Description',
  type: 'textarea',
  placeholder: 'Enter description',
  rows: 4
}
```

### Checkbox
```typescript
{
  key: 'isActive',
  label: 'Active',
  type: 'checkbox',
  defaultValue: false
}
```

## Validation

```typescript
{
  key: 'username',
  label: 'Username',
  type: 'text',
  required: true,
  validation: {
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$'
  }
}
```

## Layout Options

- `single` - Single column layout (default)
- `two-column` - Two column grid layout
- `three-column` - Three column grid layout

```typescript
const formConfig: FormConfig = {
  fields: [...],
  layout: 'two-column'
};
```

## Complete Example

```typescript
onAddNew() {
  const formConfig: FormConfig = {
    fields: [
      {
        key: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        validation: { minLength: 2 }
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'text',
        placeholder: '+1 (555) 000-0000'
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      },
      {
        key: 'notes',
        label: 'Notes',
        type: 'textarea',
        rows: 3
      }
    ],
    layout: 'two-column',
    submitLabel: 'Create Customer',
    cancelLabel: 'Cancel'
  };

  this.modalService.open({
    title: 'Create New Customer',
    size: 'lg',
    body: `<app-shared-form [config]='${JSON.stringify(formConfig)}'></app-shared-form>`,
    buttons: [
      {
        label: 'Cancel',
        class: 'btn-secondary',
        action: () => this.modalService.close()
      },
      {
        label: 'Create',
        class: 'btn-primary',
        action: () => {
          // Handle submission
        }
      }
    ]
  });
}
```

## Component Inputs

- `config: FormConfig` - Form configuration (required)
- `initialData: any` - Initial form values
- `showActions: boolean` - Show/hide form action buttons (default: true)
- `isSubmitting: boolean` - Show loading state on submit button

## Component Outputs

- `formSubmit` - Emitted when form is submitted (only if valid)
- `formCancel` - Emitted when cancel button is clicked
- `formValid` - Emitted when form validity changes

## Methods

You can access form methods via ViewChild or component reference:
- `getFormValue()` - Get current form values
- `isValid()` - Check if form is valid
- `reset()` - Reset form to initial state
