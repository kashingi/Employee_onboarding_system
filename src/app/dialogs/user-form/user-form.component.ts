import { Component, OnInit, Inject, EventEmitter, Injectable } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GolobalConstants } from '../../Shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule , DatePipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';




@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional"
  override optionalLabel = 'Optional Label';
}

@Component({
  selector: 'app-user-form',
  providers: [
    {
      provide: MatStepperIntl,
      useClass: StepperIntl,
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    DatePipe
  ],
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
    MatStepperModule,
    MatDatepickerModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  userForm: any = FormGroup;
  firstFormGroup: any = FormGroup;
  secondFormGroup: any = FormGroup;
  thirdFormGroup: any = FormGroup;
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  roles: any = [];
  selectedCV: File | null = null;
  selectedCVName: string = '';


  educationLevels = [
    { name: 'Postgraduate' },
    { name: 'Undegraduate' },
    { name: 'Diploma' },
    { name: 'Certificate' }
  ];

  classes = [
    { name: 'Honors First Class' },
    { name: 'Honors Second Class' },
    { name: 'Second Class Lower' },
    { name: 'Pass' }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    private snackbar: SnackbarService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GolobalConstants.emailRegex)]],
      phoneNumber: [null, [Validators.required, Validators.pattern(GolobalConstants.contactNumberRegex)]],
      idNumber: [null, [Validators.required, Validators.pattern(GolobalConstants.idNumber)]],
      address: [null, [Validators.required]],

      //Academic Information
      educationLevel: [null, [Validators.required]],
      universityName: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      courseName: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      courseClass: [null, [Validators.required]],
      graduationYear: [null, [Validators.required]],
      // Employment Details
      role: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      department: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      githubLink: [null, [Validators.required]],
      portfolioLink: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      employeeCV: [null, [Validators.required]]
    });

    // Listen for changes on the file input
    this.userForm.controls['employeeCV'].valueChanges.subscribe((file: File) => {
      this.selectedCV = file;
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.userForm.patchValue(this.dialogData.data);

      this.userForm.get('employeeCV')?.clearValidators();
      this.userForm.get('employeeCV')?.updateValueAndValidity();
    }
    this.getUserRoles();
  }

  onCVSelected(event: any): void {
    this.selectedCV = event.target.files[0] as File;
    if (this.selectedCV) {
      this.selectedCVName = this.selectedCV.name;
      this.userForm.controls['employeeCV'].setValue(this.selectedCV); // Update the form control value
      this.userForm.controls['employeeCV'].markAsTouched();
      this.userForm.controls['employeeCV'].updateValueAndValidity();
    } else {
      this.selectedCVName = '';
      this.userForm.controls['employeeCV'].setValue(null);
    }
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
    // var formData = this.userForm.value;
    
    const formData = this.userForm.value;
    var data: any = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      idNumber: formData.idNumber,
      address: formData.address,
      educationLevel: formData.educationLevel,
      universityName: formData.universityName,
      courseName: formData.courseName,
      courseClass: formData.courseClass,
      graduationYear: this.datePipe.transform(formData.graduationYear, 'dd-MM-yyyy'),
      role: formData.role,
      department: formData.department,
      githubLink: formData.githubLink,
      portfolioLink: formData.portfolioLink,
      startDate: this.datePipe.transform(formData.startDate, 'dd-MM-yyyy'),
      employeeCV: formData.employeeCV
    };

    
    // Append privileges based on role if needed.
    const role = this.userForm.get('role').value;
    let privileges: any[] = [];
    if (role === 'Admin') {
      privileges = [
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
        { id: 11, name: 'Access Employee Directory' }
      ];
    } else if (role === 'Developer') {
      privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Developer Resources' }
      ];
    } else if (role === 'Designer') {
      privileges = [
        { id: 1, name: 'View Own Profile' },
        { id: 2, name: 'Complete Onboarding Tasks' },
        { id: 3, name: 'Access Design Resources' }
      ];
    } else if (role === 'HR') {
      privileges = [
        { id: 1, name: 'View All Employee Profiles' },
        { id: 2, name: 'Manage Onboarding Progress' },
        { id: 3, name: 'Send Notifications' }
      ];
    }
    data = { ...data, privileges };

    

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
