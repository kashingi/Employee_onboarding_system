import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GolobalConstants } from '../../Shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-form',
  imports: [
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  userForm: any = FormGroup;
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  roles: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.emailRegex)],
      ],
      role: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.nameRegex)],
      ],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.userForm.patchValue(this.dialogData.data);
    }
    this.getUserRoles();
  }

  //Fetch users roles here
  getUserRoles() {
    this.userService.getRoles().subscribe(
      (resp: any) => {
        console.log(resp);
        this.roles = resp;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //Implement your submit action here
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.ngxService.start();
    var formData = this.userForm.value;
    var data: any = {
      // Use 'any' to allow adding 'privileges' conditionally
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (data.role === 'Admin') {
      var privileges = [
        { id: 1, name: 'Add User' },
        { id: 2, name: 'Delete User' },
        { id: 3, name: 'Edit User' },
        { id: 4, name: 'View User Profile' },
        { id: 5, name: 'Manage Onboarding Checklist' },
        { id: 6, name: 'Customize Role-Specific Tasks' },
        { id: 7, name: 'Generate Onboarding Reports' },
        { id: 8, name: 'View Onboarding Progress' },
        { id: 9, name: 'Access All Dashboards' },
        { id: 10, name: 'Send Notifications' },
        { id: 11, name: 'Access Employee Directory' },
      ];
      data = { ...data, privileges };
    } else if (data.role === 'Developer') {
      var privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Developer Resources' },
      ];
      data = { ...data, privileges };
    } else if (data.role === 'Designer') {
      var privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Design Resources' },
      ];
      data = { ...data, privileges };
    } else if (data.role === 'HR') {
      var privileges = [
        { id: 1, name: 'View All Employee Profiles' },
        { id: 2, name: 'Manage Onboarding Progress' },
        { id: 3, name: 'Send Notifications' },
      ];
      data = { ...data, privileges };
    }

    console.log(data);
    this.userService.addUser(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
        this.onAddProduct.emit();
        this.snackbar.success('User added successfully.', 'X');
      },
      (error) => {
        console.log(error);
        this.ngxService.stop();
        if (error.error?.error) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    );
  }

  edit() {
    var userId = this.dialogData.data.id;
    var formData = this.userForm.value;
    let userData: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (userData.role === 'Admin') {
      var privileges = [
        { id: 1, name: 'Add User' },
        { id: 2, name: 'Delete User' },
        { id: 3, name: 'Edit User' },
        { id: 4, name: 'View User Profile' },
        { id: 5, name: 'Manage Onboarding Checklist' },
        { id: 6, name: 'Customize Role-Specific Tasks' },
        { id: 7, name: 'Generate Onboarding Reports' },
        { id: 8, name: 'View Onboarding Progress' },
        { id: 9, name: 'Access All Dashboards' },
        { id: 10, name: 'Send Notifications' },
        { id: 11, name: 'Access Employee Directory' },
      ];
      userData = { ...userData, privileges };
    } else if (userData.role === 'Developer') {
      var privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Developer Resources' },
      ];
      userData = { ...userData, privileges };
    } else if (userData.role === 'Designer') {
      var privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Design Resources' },
      ];
      userData = { ...userData, privileges };
    } else if (userData.role === 'HR') {
      var privileges = [
        { id: 1, name: 'View All Employee Profiles' },
        { id: 2, name: 'Manage Onboarding Progress' },
        { id: 3, name: 'Send Notifications' },
      ];
      userData = { ...userData, privileges };
    }

    this.userService.updateUser(userId, userData).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.Message;
        this.snackbar.success('User updated successfully.', 'X');
      },
      (error: any) => {
        console.log(error);
        if (error.error?.error) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    );
  }
}
