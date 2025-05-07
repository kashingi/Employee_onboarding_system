import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENVIRONMENT } from '../../tokens/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { UserService } from '../../services/user.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  const mockLoader = { start: jest.fn(), stop: jest.fn() };
  const mockSnackbar = { success: jest.fn(), danger: jest.fn(), warning: jest.fn() };
  const mockUserService = {
    Role: 'Admin',
    currentUser: jest.fn(),
    getAdminRequirements: jest.fn().mockReturnValue(of([])),
    getDeveloperRequirements: jest.fn().mockReturnValue(of([])),
    getDesignerRequirements: jest.fn().mockReturnValue(of([])),
    getHRRequirements: jest.fn().mockReturnValue(of([])),
    updatePhoto: jest.fn()
  };

  beforeEach(async () => {
    // stub localStorage.getItem to always return 'Admin'
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'Admin'),
        setItem: jest.fn(() => null),
        removeItem: jest.fn(() => null),
        clear: jest.fn(() => null),
        length: 0,
        key: jest.fn(() => null),
      },
      writable: true, // Allow redefinition
    });
    await TestBed.configureTestingModule({
      imports: [
        AccountComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ENVIRONMENT, useValue: { baseUrl: 'http://localhost:3000/', production: false } },
        { provide: NgxUiLoaderService, useValue: mockLoader },
        { provide: UserService, useValue: mockUserService },
        { provide: SnackbarService, useValue: mockSnackbar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockUserService.currentUser).toHaveBeenCalled();
    expect(mockUserService.getAdminRequirements).toHaveBeenCalled();
  });
});
