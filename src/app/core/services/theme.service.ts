import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppTheme {
  id: string;
  name: string;
  fontSize: number;
  background: string;
  sidebarBg: string;
  navbarBg: string;
  primaryColor: string;
  tableHeaderBg: string;
  textColor: string;
  textLight: string;
  cardBg: string;
  sidebarTextColor: string;
  navbarTextColor: string;
}

export const PRESET_THEMES: AppTheme[] = [
  {
    id: 'default',
    name: 'Modern Blue (Light)',
    fontSize: 16,
    background: '#f7fafc',
    sidebarBg: '#ffffff',
    navbarBg: '#ffffff',
    primaryColor: '#0070C0',
    tableHeaderBg: '#f8f9fa',
    textColor: '#2D3748',
    textLight: '#718096',
    cardBg: '#ffffff',
    sidebarTextColor: '#2D3748',
    navbarTextColor: '#2D3748'
  },
  {
    id: 'dark-pro',
    name: 'Professional Dark',
    fontSize: 16,
    background: '#1a202c',
    sidebarBg: '#2d3748',
    navbarBg: '#2d3748',
    primaryColor: '#63b3ed',
    tableHeaderBg: '#4a5568',
    textColor: '#f7fafc',
    textLight: '#cbd5e0',
    cardBg: '#2d3748',
    sidebarTextColor: '#f7fafc',
    navbarTextColor: '#f7fafc'
  },
  {
    id: 'emerald',
    name: 'Emerald Harmony',
    fontSize: 16,
    background: '#f0fdf4',
    sidebarBg: '#ffffff',
    navbarBg: '#ffffff',
    primaryColor: '#10b981',
    tableHeaderBg: '#dcfce7',
    textColor: '#064e3b',
    textLight: '#34d399',
    cardBg: '#ffffff',
    sidebarTextColor: '#064e3b',
    navbarTextColor: '#064e3b'
  },
  {
    id: 'midnight',
    name: 'Midnight Purple',
    fontSize: 16,
    background: '#0f172a',
    sidebarBg: '#1e293b',
    navbarBg: '#1e293b',
    primaryColor: '#8b5cf6',
    tableHeaderBg: '#334155',
    textColor: '#f1f5f9',
    textLight: '#94a3b8',
    cardBg: '#1e293b',
    sidebarTextColor: '#f1f5f9',
    navbarTextColor: '#f1f5f9'
  },
  {
    id: 'soft-sepia',
    name: 'Warm Sepia',
    fontSize: 16,
    background: '#fdfbf7',
    sidebarBg: '#f7f2ea',
    navbarBg: '#f7f2ea',
    primaryColor: '#c2410c',
    tableHeaderBg: '#ffedd5',
    textColor: '#431407',
    textLight: '#9a3412',
    cardBg: '#fcfaf6',
    sidebarTextColor: '#431407',
    navbarTextColor: '#431407'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultTheme: AppTheme = PRESET_THEMES[0];

  private theme = new BehaviorSubject<AppTheme>(this.defaultTheme);
  theme$ = this.theme.asObservable();

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const saved = localStorage.getItem('erp_theme');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.applyTheme({ ...this.defaultTheme, ...parsed });
    } else {
      this.applyTheme(this.defaultTheme);
    }
  }

  applyTheme(newTheme: AppTheme) {
    this.theme.next(newTheme);
    localStorage.setItem('erp_theme', JSON.stringify(newTheme));

    const root = document.documentElement;
    root.style.setProperty('--app-font-size', `${newTheme.fontSize}px`);
    root.style.setProperty('--app-background', newTheme.background);
    root.style.setProperty('--sidebar-bg', newTheme.sidebarBg);
    root.style.setProperty('--navbar-bg', newTheme.navbarBg);
    root.style.setProperty('--primary-blue', newTheme.primaryColor);
    root.style.setProperty('--table-header-bg', newTheme.tableHeaderBg);
    root.style.setProperty('--text-dark', newTheme.textColor);
    root.style.setProperty('--text-light', newTheme.textLight);
    root.style.setProperty('--white', newTheme.cardBg);
    root.style.setProperty('--sidebar-text', newTheme.sidebarTextColor);
    root.style.setProperty('--navbar-text', newTheme.navbarTextColor);
    root.style.setProperty('--border', this.isDark(newTheme.background) ? 'rgba(255,255,255,0.1)' : '#E2E8F0');

    // Set RGB variable for primary color to allow rgba() usage
    const rgb = this.hexToRgb(newTheme.primaryColor);
    if (rgb) {
      root.style.setProperty('--primary-blue-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }

  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  updatePart(part: Partial<AppTheme>) {
    const updated = { ...this.theme.value, ...part };
    
    // Auto-adjust text colors if backgrounds change
    if (part.background) {
      updated.textColor = this.isDark(part.background) ? '#f7fafc' : '#2D3748';
      updated.textLight = this.isDark(part.background) ? '#cbd5e0' : '#718096';
      updated.cardBg = this.isDark(part.background) ? this.lightenDarkenColor(part.background, 20) : '#ffffff';
    }

    if (part.sidebarBg) {
      updated.sidebarTextColor = this.isDark(part.sidebarBg) ? '#f7fafc' : '#2D3748';
    }

    if (part.navbarBg) {
      updated.navbarTextColor = this.isDark(part.navbarBg) ? '#f7fafc' : '#2D3748';
    }

    // Mark as custom
    if (!part.id && this.theme.value.id !== 'custom') {
      updated.id = 'custom';
      updated.name = 'Custom Theme';
    }
    
    this.applyTheme(updated);
  }

  // Helper to determine if color is dark
  private isDark(color: string): boolean {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  // Helper to lighten/darken color
  private lightenDarkenColor(col: string, amt: number) {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  getPresets() {
    return PRESET_THEMES;
  }

  get currentTheme() { return this.theme.value; }
}
