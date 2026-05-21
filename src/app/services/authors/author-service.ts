import { Injectable } from '@angular/core';
import { AuthorModel } from '../../models/author-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService extends BaseService<AuthorModel> {
  protected readonly path = '/authors';
}
