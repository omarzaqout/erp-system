import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalConfig } from '../components/modal/modal.component';
import { ModalFormConfig } from '../components/modal-form/modal-form.component';

interface ModalState {
  isOpen: boolean;
  config: ModalConfig | null;
  formConfig: ModalFormConfig | null;
  mode: 'standard' | 'form';
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<ModalState>({
    isOpen: false,
    config: null,
    formConfig: null,
    mode: 'standard'
  });

  public modalState$: Observable<ModalState> = this.modalState.asObservable();

  open(config: ModalConfig): void {
    this.modalState.next({
      isOpen: true,
      config,
      formConfig: null,
      mode: 'standard'
    });
  }

  openForm(config: ModalFormConfig): void {
    this.modalState.next({
      isOpen: true,
      config: null,
      formConfig: config,
      mode: 'form'
    });
  }

  close(): void {
    this.modalState.next({
      isOpen: false,
      config: null,
      formConfig: null,
      mode: 'standard'
    });
  }

  isOpen(): boolean {
    return this.modalState.value.isOpen;
  }
}
