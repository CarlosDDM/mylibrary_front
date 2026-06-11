import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfBrowser } from './bookshelf-browser';

describe('BookshelfBrowser', () => {
  let component: BookshelfBrowser;
  let fixture: ComponentFixture<BookshelfBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookshelfBrowser],
    }).compileComponents();

    fixture = TestBed.createComponent(BookshelfBrowser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
