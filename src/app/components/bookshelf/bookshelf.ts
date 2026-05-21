import { Component, input, output } from '@angular/core';
import { CatalogCard, CatalogCardType } from '../catalog-card/catalog-card';
import { CatalogCardModel } from '../../models/catalog-card-model';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-bookshelf',
  imports: [CatalogCard, Button],
  templateUrl: './bookshelf.html',
})
export class Bookshelf {
  titleSection = input.required<string>();
  seeAllClicked = output<void>();
  cardClick = output<string>();

  typeCard = input.required<CatalogCardType>();

  data = input.required<CatalogCardModel[]>();
}
