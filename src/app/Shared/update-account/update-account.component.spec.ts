import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAccountComponent } from './update-account.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { of } from 'rxjs';

describe('UpdateAccountComponent', () => {
  let component: UpdateAccountComponent;
  let fixture: ComponentFixture<UpdateAccountComponent>;

  const mockLoader = { start: jest.fn(), stop: jest.fn() };
  const mockUserService = {
    updateUserByEmail: jest.fn().mockReturnValue(of({ Message: 'ok' })),
    // add other methods if needed
  };
  const mockSnackbar = {
    success: jest.fn(),
    danger: jest.fn()
  };
  const mockDialogRef = {
    close: jest.fn()
  };
  const dialogData = {
    data: {
      id: 1,
      startDate: '01-01-2020',
      graduationYear: '01-01-2010',
      role: 'Admin'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateAccountComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: NgxUiLoaderService, useValue: mockLoader },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: DatePipe, useClass: DatePipe },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
