import { effect, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'admin-menu-expanded';

@Injectable({
  providedIn: 'root',
})
export class AdminMenuService {
  private readonly _expandedGroups = signal<ReadonlySet<string>>(this.restore());
  readonly expandedGroups = this._expandedGroups.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this._expandedGroups()]));
    });
  }

  isExpanded(label: string): boolean {
    return this._expandedGroups().has(label);
  }

  toggleGroup(label: string): void {
    this._expandedGroups.update((set) => {
      const next = new Set(set);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  private restore(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      return new Set();
    }
  }
}
