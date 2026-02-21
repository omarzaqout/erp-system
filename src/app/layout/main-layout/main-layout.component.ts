import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModuleService } from '../../core/services/module.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  showMobileMenu = false;
  modules: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private moduleService: ModuleService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.moduleService.modules$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mods: any[]) => {
        this.modules = mods.filter(m => m.enabled);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleNotifications() {
     // Trigger notification dropdown in header or simply navigate
     this.router.navigate(['/notifications']);
  }

  closeSidebar() {
    document.querySelector('.main-wrapper')?.classList.remove('sidebar-open');
  }
}
