import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-modal></app-modal>
  `,
  styles: []
})
export class AppComponent {
  title = 'ERP System';
}
