import { FormConfig } from '../components/shared-form/shared-form.component';

/**
 * Pre-configured form templates for common entities
 * Use these as starting points and customize as needed
 */

export const OrderFormConfig: FormConfig = {
  fields: [
    {
      key: 'customerName',
      label: 'Customer Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      key: 'total',
      label: 'Total Amount',
      type: 'currency',
      placeholder: '0.00',
      required: true,
      validation: {
        min: 0.01
      },
      step: 0.01
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      defaultValue: 'pending'
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'partial', label: 'Partial' }
      ],
      defaultValue: 'pending'
    },
    {
      key: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Additional notes...',
      rows: 3
    }
  ],
  layout: 'two-column',
  submitLabel: 'Create Order',
  cancelLabel: 'Cancel'
};

export const CustomerFormConfig: FormConfig = {
  fields: [
    {
      key: 'name',
      label: 'Customer Name',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'customer@example.com',
      required: true
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: '+1 (555) 000-0000'
    },
    {
      key: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Company name'
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Street address...',
      rows: 2
    },
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
  ],
  layout: 'two-column',
  submitLabel: 'Create Customer',
  cancelLabel: 'Cancel'
};

export const ProductFormConfig: FormConfig = {
  fields: [
    {
      key: 'sku',
      label: 'SKU',
      type: 'text',
      placeholder: 'Product SKU',
      required: true
    },
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 200
      }
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'food', label: 'Food & Beverages' },
        { value: 'other', label: 'Other' }
      ]
    },
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
    },
    {
      key: 'quantity',
      label: 'Stock Quantity',
      type: 'number',
      placeholder: '0',
      required: true,
      validation: {
        min: 0
      }
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Product description...',
      rows: 4
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'out_of_stock', label: 'Out of Stock' }
      ],
      defaultValue: 'active'
    }
  ],
  layout: 'two-column',
  submitLabel: 'Create Product',
  cancelLabel: 'Cancel'
};

export const EmployeeFormConfig: FormConfig = {
  fields: [
    {
      key: 'employeeId',
      label: 'Employee ID',
      type: 'text',
      placeholder: 'EMP-001',
      required: true
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'First name',
      required: true
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Last name',
      required: true
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'employee@company.com',
      required: true
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: '+1 (555) 000-0000'
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { value: 'sales', label: 'Sales' },
        { value: 'hr', label: 'Human Resources' },
        { value: 'it', label: 'IT' },
        { value: 'finance', label: 'Finance' },
        { value: 'operations', label: 'Operations' }
      ]
    },
    {
      key: 'position',
      label: 'Position',
      type: 'text',
      placeholder: 'Job title',
      required: true
    },
    {
      key: 'hireDate',
      label: 'Hire Date',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'on_leave', label: 'On Leave' }
      ],
      defaultValue: 'active'
    }
  ],
  layout: 'two-column',
  submitLabel: 'Create Employee',
  cancelLabel: 'Cancel'
};
