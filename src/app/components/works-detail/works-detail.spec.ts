import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorksDetail } from './works-detail';

describe('WorksModal', () => {
  let component: WorksDetail;
  let fixture: ComponentFixture<WorksDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorksDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(WorksDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
