import { Component, inject, OnInit } from '@angular/core';
import { Bookshelf } from '../bookshelf/bookshelf';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from '../../services/api/api-service';

@Component({
  selector: 'app-item-profile',
  imports: [Bookshelf],
  templateUrl: './item-profile.html',
})
export class ItemProfile implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  id = this.config.data?.id;
  endpoint = this.config.data?.endpoint;

  ngOnInit() {}
}
