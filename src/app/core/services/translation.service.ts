import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TRANSLATIONS } from '../i18n/translations';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<Language>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    // Load from storage or default
    const savedLang = localStorage.getItem('erp_language') as Language;
    if (savedLang) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('en');
    }
  }

  setLanguage(lang: Language) {
    this.currentLangSubject.next(lang);
    localStorage.setItem('erp_language', lang);
    
    // Update direction
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Also set on body for some frameworks/styles that check body
    document.body.dir = dir;
    
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      console.log('Language set to Arabic, direction RTL');
    } else {
      document.body.classList.remove('rtl');
      console.log('Language set to English, direction LTR');
    }
  }

  get currentLang(): Language {
    return this.currentLangSubject.value;
  }

  translate(key: string): string {
    const lang = this.currentLang;
    const dictionary = TRANSLATIONS[lang] as any;
    return dictionary[key] || key; // Fallback to key if not found
  }
}
