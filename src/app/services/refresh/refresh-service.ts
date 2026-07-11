import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ENTITY_ERROR } from '../../constants/error-messages-constant';

export type RefreshEntity = keyof typeof ENTITY_ERROR;

/**
 * Broadcasts when an entity is created so any mounted list can reload itself.
 * Creation is triggered away from the lists (e.g. the admin sidebar), so this
 * decouples the emitter (FacadeDialogService) from the subscribers (pages).
 */
@Injectable({ providedIn: 'root' })
export class RefreshService {
  private readonly _created = new Subject<RefreshEntity>();
  readonly created$: Observable<RefreshEntity> = this._created.asObservable();

  created(entity: RefreshEntity): void {
    this._created.next(entity);
  }
}
