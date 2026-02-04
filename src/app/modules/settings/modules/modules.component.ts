import { Component, OnInit } from '@angular/core';
import { ModuleService, Module } from '../../../core/services/module.service';

@Component({
  selector: 'app-modules',
  template: `
    <div class="modules-page">
      <div class="page-header">
        <div>
          <h2>Module Management</h2>
          <p class="text-muted">Enable or disable modules according to your business needs</p>
        </div>
      </div>

      <div class="modules-grid">
        <div 
          *ngFor="let module of modules"
          class="module-card"
          [class.enabled]="module.enabled"
          [class.disabled]="!module.enabled">
          <div class="module-header">
            <div class="module-icon">
              <i [class]="module.icon"></i>
            </div>
            <div class="module-toggle">
              <label class="toggle-switch">
                <input 
                  type="checkbox"
                  [checked]="module.enabled"
                  (change)="toggleModule(module)"
                  [disabled]="!canToggle(module)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="module-body">
            <h5 class="module-name">{{ module.displayName }}</h5>
            <p class="module-description">{{ module.description }}</p>
            
            <div class="module-features" *ngIf="module.features && module.features.length > 0">
              <div class="feature-tag" *ngFor="let feature of module.features">
                {{ feature }}
              </div>
            </div>

            <div class="module-dependencies" *ngIf="module.dependencies && module.dependencies.length > 0">
              <small class="text-muted">
                <i class="fas fa-link"></i> Depends on: 
                {{ getDependencyNames(module.dependencies).join(', ') }}
              </small>
            </div>
          </div>

          <div class="module-footer">
            <button 
              class="btn btn-sm"
              [class.btn-primary]="module.enabled"
              [class.btn-outline-secondary]="!module.enabled"
              [routerLink]="module.route"
              [disabled]="!module.enabled">
              <i class="fas fa-arrow-right"></i> Open
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modules-page {
      .page-header {
        margin-bottom: 2rem;
        
        h2 {
          margin-bottom: 0.5rem;
        }
      }

      .modules-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .module-card {
        background: white;
        border: 2px solid var(--border);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;

        &.enabled {
          border-color: var(--success-green);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.1);
        }

        &.disabled {
          opacity: 0.7;
          border-color: var(--border);
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .module-icon {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            background: var(--light-blue);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            color: var(--primary-blue);
          }

          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;

            input {
              opacity: 0;
              width: 0;
              height: 0;

              &:checked + .toggle-slider {
                background-color: var(--success-green);

                &:before {
                  transform: translateX(24px);
                }
              }

              &:disabled + .toggle-slider {
                opacity: 0.5;
                cursor: not-allowed;
              }
            }

            .toggle-slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: var(--border);
              transition: 0.3s;
              border-radius: 26px;

              &:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
              }
            }
          }
        }

        .module-body {
          flex: 1;
          margin-bottom: 1rem;

          .module-name {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-dark);
          }

          .module-description {
            color: var(--text-light);
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }

          .module-features {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;

            .feature-tag {
              background: var(--light-blue);
              color: var(--primary-blue);
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
            }
          }

          .module-dependencies {
            padding-top: 0.75rem;
            border-top: 1px solid var(--border);
          }
        }

        .module-footer {
          button {
            width: 100%;
          }
        }
      }
    }
  `]
})
export class ModulesComponent implements OnInit {
  modules: Module[] = [];

  constructor(private moduleService: ModuleService) {}

  ngOnInit() {
    this.moduleService.modules$.subscribe(modules => {
      this.modules = modules.sort((a, b) => a.order - b.order);
    });
  }

  toggleModule(module: Module) {
    if (module.enabled) {
      this.moduleService.disableModule(module.id);
    } else {
      this.moduleService.enableModule(module.id);
    }
  }

  canToggle(module: Module): boolean {
    // Essential modules cannot be disabled
    if (['dashboard', 'settings'].includes(module.id)) {
      return false;
    }
    return true;
  }

  getDependencyNames(dependencies: string[]): string[] {
    return dependencies.map(depId => {
      const dep = this.moduleService.getModuleById(depId);
      return dep ? dep.displayName : depId;
    });
  }
}
