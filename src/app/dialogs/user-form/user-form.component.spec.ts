import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { MatNativeDateModule } from '@angular/material/core';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

   // Mock implementations
   const mockDialogRef = {
    close: jest.fn(),
  };

  const mockUserService = {
    getRoles: jest.fn().mockReturnValue(of([])),
  };

  const mockNgxUiLoaderService = {
    start: jest.fn(),
    stop: jest.fn(),
  };

  const mockSnackbarService = {
    success: jest.fn(),
    danger: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        MatNativeDateModule
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: { action: 'Add' } },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserService, useValue: mockUserService },
        { provide: NgxUiLoaderService, useValue: mockNgxUiLoaderService },
        { provide: SnackbarService, useValue: mockSnackbarService },
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
