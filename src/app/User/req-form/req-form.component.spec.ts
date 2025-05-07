import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqFormComponent } from './req-form.component';
import { UserService } from '../../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { of } from 'rxjs';
describe('ReqFormComponent', () => {
  let component: ReqFormComponent;
  let fixture: ComponentFixture<ReqFormComponent>;


  const mockUserService = {
    user: { id: 123 },
    Role: 'Admin',
    updateUser: jest.fn().mockReturnValue({
      subscribe: (obs: any) => obs.next()
    })
  };
  const mockLoader = {
    start: jest.fn(),
    stop: jest.fn()
  };
  const mockSnackbar = {
    success: jest.fn(),
    danger: jest.fn()
  };
  const mockDialogRef = {
    close: jest.fn()
  };
  const mockDialogData = {
    data: 'requirement'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReqFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: NgxUiLoaderService, useValue: mockLoader },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with dialog data', () => {
    expect(component.fieldName).toBe('requirement');
    expect(component.reqForm.contains('requirement')).toBe(true);
  });

  it('addRequirement should call updateUser and close dialog on success', () => {
    component.reqForm.setValue({ requirement: 'New Item' });
    component.addRequirement();
    expect(mockLoader.start).toHaveBeenCalled();
    expect(mockUserService.updateUser).toHaveBeenCalledWith(123, { requirement: 'New Item' });
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockSnackbar.success).toHaveBeenCalledWith('requirement added successfully.', 'X');
    expect(mockLoader.stop).toHaveBeenCalled();
  });
});
