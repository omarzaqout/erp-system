import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false // Impure because we want it to update when service language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string): string {
    if (!value) return '';
    return this.translationService.translate(value);
  }
}
