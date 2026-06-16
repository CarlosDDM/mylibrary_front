import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfWork } from './bookshelf-work';

describe('BookshelfWork', () => {
  let component: BookshelfWork;
  let fixture: ComponentFixture<BookshelfWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookshelfWork],
    }).compileComponents();

    fixture = TestBed.createComponent(BookshelfWork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
