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

  constructor(
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private snackbar: SnackbarService,
    private router: Router,
    private loginService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.emailRegex)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(GolobalConstants.passwordRegex),
        ],
      ],
    });
  }

  //handle submit action here
  login() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var loginData = {
      email: formData.email,
      password: formData.password,
    };
    console.log(loginData);
    // this.loginService.login(loginData).subscribe(
    //   (resp: any)=>{
    //     this.ngxService.stop()
    //     console.log(resp)
    //   },
    //   (error: any)=>{
    //     this.ngxService.stop();
    //     console.log(error)
    //   }
    // );
    if (this.loginForm.valid) {
      var formData = this.loginForm.value;
      console.log(this.loginForm.value);
      this.router.navigate(['admin/home/dashboard']);
      this.ngxService.stop();
      this.snackbar.success('Login Successfully.', 'X');
    }
  }
}
