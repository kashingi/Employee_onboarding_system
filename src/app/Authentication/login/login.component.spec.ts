import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of, throwError} from 'rxjs'
import { Router } from '@angular/router';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockUserService = {
    currentUser: jest.fn(),
    getLoggedInUser: jest.fn()
  };

  const mockSnackbar = {
    success: jest.fn(),
    warning: jest.fn(),
    danger: jest.fn()
  };

  const mockLoader = {
    start: jest.fn(),
    stop: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: NgxUiLoaderService, useValue: mockLoader }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call getLoggedInUser and navigate to Dashboard for Admin', () => {
    // Inject and spy on the Router
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');
  
    // Mock the getLoggedInUser response
    mockUserService.getLoggedInUser.mockReturnValue(of([{ role: 'Admin' }]));
  
    // Set form values
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'admin123',
    });
  
    // Call the login method
    component.login();
  
    // Verify expectations
    expect(mockLoader.start).toHaveBeenCalled();
    expect(mockUserService.getLoggedInUser).toHaveBeenCalledWith('admin@example.com');
    expect(navigateSpy).toHaveBeenCalledWith(['admin/home/dashboard']);
    expect(mockSnackbar.success).toHaveBeenCalledWith('Login Successfully.', 'X');
    expect(mockLoader.stop).toHaveBeenCalled();
  });

  it('Should show warning when role is unregistered', ()=>{
    mockUserService.getLoggedInUser.mockReturnValue(of([{role: 'Guest'}]));

    component.login();

    expect(mockSnackbar.warning).toHaveBeenCalledWith('Kindly register to access this system.', 'X');
  });

  it('Should show danger snackbar on API error', ()=>{
    mockUserService.getLoggedInUser.mockReturnValue(throwError(()=> new Error('Server error')));

    component.login();

    expect(mockLoader.start).toHaveBeenCalled();
    expect(mockLoader.stop).toHaveBeenCalled();
    expect(mockSnackbar.danger).toHaveBeenCalledWith('An error occured. Kindly try again later.', 'X');

  });

});
