import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge'
})
export class StatusBadgePipe implements PipeTransform {

  transform(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'bg-success',
      'inactive': 'bg-secondary',
      'pending': 'bg-warning',
      'processing': 'bg-info',
      'completed': 'bg-success',
      'shipped': 'bg-primary',
      'delivered': 'bg-success',
      'cancelled': 'bg-danger',
      'paid': 'bg-success',
      'unpaid': 'bg-danger',
      'overdue': 'bg-danger',
      'draft': 'bg-secondary',
      'sent': 'bg-info',
      'approved': 'bg-success',
      'received': 'bg-success',
      'in_stock': 'bg-success',
      'low_stock': 'bg-warning',
      'out_of_stock': 'bg-danger',
      'new': 'bg-info',
      'contacted': 'bg-primary',
      'qualified': 'bg-success',
      'proposal': 'bg-warning',
      'negotiation': 'bg-info',
      'closed': 'bg-secondary',
      'on_leave': 'bg-warning',
      'terminated': 'bg-danger'
    };

    return statusClasses[status.toLowerCase()] || 'bg-secondary';
  }
}
