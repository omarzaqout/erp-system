import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppEvent } from './app-event';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<AppEvent>();

  emit(event: AppEvent) {
    this.subject.next(event);
  }

  on<T>(eventType: string): Observable<T> {
    return this.subject.pipe(
      filter((e: AppEvent) => e.type === eventType),
      map((e: AppEvent) => e.payload)
    );
  }
}
