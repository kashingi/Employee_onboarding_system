import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChecklistComponent } from './update-checklist.component';

describe('UpdateChecklistComponent', () => {
  let component: UpdateChecklistComponent;
  let fixture: ComponentFixture<UpdateChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
