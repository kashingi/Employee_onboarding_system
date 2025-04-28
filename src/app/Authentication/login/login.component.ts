import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GolobalConstants } from '../../Shared/global-constants';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatLabel,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: any = FormGroup;
  resposeMessage: any;
  userRole: any;

  constructor(
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private snackbar: SnackbarService,
    private router: Router,
    private loginService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GolobalConstants.emailRegex)]],
      password: [null, [Validators.required, Validators.pattern(GolobalConstants.passwordRegex)]],
    });

    this.loginService.currentUser();
  }

  //handle submit action here
  login() {
    this.ngxService.start();
    let formData = this.loginForm.value;
    let loginData = {
      email: formData.email,
      password: formData.password,
    };
    localStorage.setItem('loggedInEmail', loginData.email);
    let userEmail = formData.email;
    this.loginService.getLoggedInUser(userEmail).subscribe(
      (resp: any) => {
        console.log("The user is : ", resp[0]);
        this.userRole = resp[0].role;
        localStorage.setItem('userRole', this.userRole);
        console.log(this.userRole)
        if (this.userRole === 'Admin') {
          this.router.navigate(['admin/home/dashboard']);
          this.ngxService.stop();
          this.snackbar.success('Login Successfully.', 'X');
        } else if (this.userRole === 'Developer' || this.userRole === 'Designer' || this.userRole === 'HR') {
          this.router.navigate(['user/home/dashboard']);
          this.ngxService.stop();
          this.snackbar.success('Login Successfully.', 'X');
        } else {
          this.snackbar.warning("Kindly register to access this system.", "X");
        }
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
        this.snackbar.danger("An error occured. Kindly try again later.", "X");
      }
    );
    // this.loginService.loginUser(loginData).subscribe(
    //   (resp: any)=>{
    //     this.ngxService.stop()
    //     console.log(resp);
    //     console.log("The user is : ", resp[0]);
    //     this.userRole = resp[0].role;
    //     localStorage.setItem('userRole', this.userRole);
    //     console.log(this.userRole)
    //     if (this.userRole === 'Admin') {
    //       this.router.navigate(['admin/home/dashboard']);
    //       this.ngxService.stop();
    //       this.snackbar.success('Login Successfully.', 'X');
    //     } else if (this.userRole === 'Developer' || this.userRole === 'Designer' || this.userRole === 'HR') {
    //       this.router.navigate(['user/home/dashboard']);
    //       this.ngxService.stop();
    //       this.snackbar.success('Login Successfully.', 'X');
    //     }else{
    //       this.snackbar.warning("Kindly register to access this system.", "X");
    //     }
    //   },
    //   (error: any)=>{
    //     this.ngxService.stop();
    //     console.log(error);
    //     this.snackbar.danger("An error occured. Kindly try again later.", "X");
    //   }
    // );

  }
}
