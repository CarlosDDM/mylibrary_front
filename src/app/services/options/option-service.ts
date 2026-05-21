import { Injectable } from '@angular/core';
import { OptionsModel } from '../../models/option-model';
import { BaseService } from '../base/base-service';

@Injectable({
  providedIn: 'root',
})
export class OptionService extends BaseService<OptionsModel> {
  protected readonly path = '/options';

  getOptions() {
    return this.apiRequest.get<OptionsModel>(this.path);
  }
}
