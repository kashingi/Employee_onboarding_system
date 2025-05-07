import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersComponent } from './manage-users.component';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;

  const mockDialogRef = {
    close: jest.fn(),
  };

  const mockUserService = {
    addUser: jest.fn().mockReturnValue(of({})),
    updateTask: jest.fn().mockReturnValue(of({}))
  };

  const mockNgxUiLoaderService = {
    start: jest.fn(),
    stop: jest.fn(),
  };

  const mockSnackbarService = {
    success: jest.fn(),
    danger: jest.fn(),
  };

  const mockDialogData = {
    action: 'Add',
    data: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ManageUsersComponent
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: UserService, useValue: mockUserService },
        { provide: NgxUiLoaderService, useValue: mockNgxUiLoaderService },
        { provide: SnackbarService, useValue: mockSnackbarService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
