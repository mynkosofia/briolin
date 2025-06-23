import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categorySource = new BehaviorSubject<string>('');
  category$ = this.categorySource.asObservable();

  // Додаємо Subject для скидання пошуку
  resetSearch$ = new Subject<void>();

  setCategory(category: string) {
    this.categorySource.next(category);
  }

  resetSearch() {
    this.resetSearch$.next();
  }
}