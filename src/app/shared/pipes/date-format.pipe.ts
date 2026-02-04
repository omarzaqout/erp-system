import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'erpDate'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date | string, format: string = 'short'): string {
    if (!value) return '';
    
    const date = new Date(value);
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (format === 'long') {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } else if (format === 'datetime') {
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString();
  }
}
