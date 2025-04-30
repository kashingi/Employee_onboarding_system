import { Component, Inject, OnInit, EventEmitter, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { GolobalConstants } from '../../Shared/global-constants';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-manage-users',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit {
  #fb = inject(FormBuilder)
  userForm = this.#fb.group({
    name: ['', [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
    email: ['', [Validators.required, Validators.pattern(GolobalConstants.emailRegex)]],
    department: ['', [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
    role: ['', [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
    userStatus: ['Inactive', Validators.required],
    password: ['', [Validators.required, Validators.pattern(GolobalConstants.passwordRegex)],

    ],
  });
  ;

  onAddProduct = output();
  onEditProduct = output();
  dialogAction = 'Add';
  action = 'Add';
  responseMessage = '';

  hide = true;

  userStatus = [
    { name: 'Active' },
    { name: 'Inactive' }
  ]

  roles = [
    { name: 'Admin' },
    { name: 'Developer' },
    { name: 'Designer' },
    { name: 'HR' }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    public dialogRef: MatDialogRef<ManageUsersComponent>,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.userForm.patchValue(this.dialogData.data);



      // Patch the form with all fields including parsed date
      this.userForm.patchValue({
        ...this.dialogData.data,
      });
    }
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
    let formData = this.userForm.value;
    let taskData = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      password: formData.password,
      userStatus: formData.userStatus,
    };

    console.log(taskData);
    this.userService.addUser(taskData).subscribe(
      {
        next: (response: any) => {
          this.dialogRef.close();
          this.ngxService.stop();
          this.onAddProduct.emit();
          this.snackbar.success('Task added successfully.', 'X');
        },
        error: (error) => {
          console.log(error);
          this.snackbar.danger("The system is busty, kindly try again later.", "X")
          this.ngxService.stop();
          if (error.error?.error) {
            this.responseMessage = error.error?.Message;
          } else {
            this.responseMessage = GolobalConstants.genericError;
          }
          this.snackbar.danger(this.responseMessage, GolobalConstants.error);
        }
      }
    )
  }

edit() {
  let taskId = this.dialogData.data.id;
  let formData = this.userForm.value;
  let updateData = {
    name: formData.name,
    email: formData.email,
    department: formData.department,
    role: formData.role,
    password: formData.password,
    userStatus: formData.userStatus,
  };
  console.log(taskId, updateData);
  this.userService.updateTask(taskId, updateData).subscribe(
    (response: any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.Message;
      this.snackbar.success('Task updated successfully.', 'X');
    },
    (error) => {
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
