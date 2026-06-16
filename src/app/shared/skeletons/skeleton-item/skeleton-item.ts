import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-skeleton-item',
  imports: [SkeletonModule],
  templateUrl: './skeleton-item.html',
})
export class SkeletonItem {}
