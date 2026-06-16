import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfSerie } from './bookshelf-serie';

describe('BookshelfSerie', () => {
  let component: BookshelfSerie;
  let fixture: ComponentFixture<BookshelfSerie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookshelfSerie],
    }).compileComponents();

    fixture = TestBed.createComponent(BookshelfSerie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
