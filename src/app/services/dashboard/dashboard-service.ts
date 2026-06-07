import { inject, Injectable } from '@angular/core';
import { DashboardStatsModel } from '../../models/dashboard/dashboard-stats-model';
import { ApiService } from '../api/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiRequest = inject(ApiService);
  private readonly path = '/dashboard';

  getStats(): Observable<DashboardStatsModel> {
    return this.apiRequest.get<DashboardStatsModel>(`${this.path}/statistics`);
  }
}
