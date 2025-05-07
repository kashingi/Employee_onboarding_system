import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;


  const mockUserService = {
    getUsers: jest.fn().mockReturnValue(of([])),
    deleteUser: jest.fn().mockReturnValue(of({}))
  };
  const mockSnackbar = {
    success: jest.fn(),
    danger: jest.fn(),
    warning: jest.fn()
  };
  const mockLoader = {
    start: jest.fn(),
    stop: jest.fn()
  };
  const mockDialog = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        onAddProduct: of(),
        onEditProduct: of(),
        onEmitStatusChange: of()
      },
      close: jest.fn()
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        HttpClientTestingModule,  // for HttpClient inside UserService
        RouterTestingModule,       
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: NgxUiLoaderService, useValue: mockLoader },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users into the table dataSource', () => {
    expect(mockLoader.start).toHaveBeenCalled();
    expect(mockUserService.getUsers).toHaveBeenCalled();
    // after the Observable emits [], dataSource should be defined
    expect(component.dataSource).toBeDefined();
    expect(mockLoader.stop).toHaveBeenCalled();
  });
});
