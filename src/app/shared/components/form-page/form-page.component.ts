import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedFormComponent, FormConfig } from '../shared-form/shared-form.component';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss']
})
export class FormPageComponent implements OnInit {
  @Input() title: string = 'Create New';
  @Input() icon?: string;
  @Input() formConfig!: FormConfig;
  @Input() initialData: any = null;
  @Input() breadcrumbs: { label: string; route?: string }[] = [];
  @Input() backRoute?: string;
  @Input() onSubmit?: (data: any) => void;
  
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Get initial data from route if available
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.initialData = JSON.parse(params['data']);
        } catch (e) {
          console.error('Error parsing initial data:', e);
        }
      }
    });
  }

  onFormSubmit(data: any) {
    this.isSubmitting = true;
    
    if (this.onSubmit) {
      this.onSubmit(data);
    }
    
    // After submission, navigate back or to success page
    setTimeout(() => {
      this.isSubmitting = false;
      this.goBack();
    }, 500);
  }

  onFormCancel() {
    this.goBack();
  }

  goBack() {
    if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      this.location.back();
    }
  }
}
