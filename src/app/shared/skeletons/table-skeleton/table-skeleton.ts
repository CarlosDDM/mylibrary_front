import { Component, computed, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column } from '../../../pages/management-page/components/management-table/management-table';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-table-skeleton',
  imports: [TableModule, Skeleton],
  templateUrl: './table-skeleton.html',
})
export class TableSkeleton {
  cols = input<Column[]>();
  skeletonCount = input<number>(10);

  // Items must be truthy: p-table routes falsy rows to the (missing) #loadingbody template.
  protected readonly rows = computed(() => Array.from({ length: this.skeletonCount() }, () => ({})));
}
