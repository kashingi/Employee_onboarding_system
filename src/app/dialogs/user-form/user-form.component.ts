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
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';



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
    MatDatepickerModule,
    MatProgressBarModule
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
  selectedPhoto: File | null = null;
  selectedPhotoName: string = '';

  mode: ProgressBarMode = 'buffer';
  value = 35;
  value1 = 65;
  value2 = 85;


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
  ];

  statuses = [
    { name: 'Active' },
    { name: 'Inactive' }
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
      userProfile: [null, [Validators.required, GolobalConstants.imageFileValidator]],

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
      employeeCV: [null, [Validators.required]],

      //Admin to modify
      userStatus: ['Inactive']
    });

    // Listen for changes on the file input
    this.userForm.controls['employeeCV'].valueChanges.subscribe((file: File) => {
      this.selectedCV = file;
    });

    this.userForm.controls['userProfile'].valueChanges.subscribe((file: File) => {
      this.selectedPhoto = file;
    });

    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      // this.userForm.patchValue(this.dialogData.data);

      this.userForm.get('employeeCV')?.clearValidators();
      this.userForm.get('employeeCV')?.updateValueAndValidity();

      // Parse the date string into a real Date object
      const parsedDate = this.parseDate(this.dialogData.data.startDate);
      const passGraduation = this.passGration(this.dialogData.data.graduationYear);

      // Patch the form with all fields including parsed date
      this.userForm.patchValue({
        ...this.dialogData.data,
        startDate: parsedDate,
        graduationYear: passGraduation
      });
    }

    // Watch role change
    this.userForm.get('role')?.valueChanges.subscribe((role: string) => {
      this.updateRoleBasedValidators(role);
    });

    this.getUserRoles();
  }

  
  onCVSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
  
    this.selectedCVName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is like "data:application/pdf;base64,JVBERi0xL..."
      const base64 = (reader.result as string).split(',')[1];
      this.userForm.controls['employeeCV'].setValue(base64);
      this.userForm.controls['employeeCV'].markAsTouched();
      this.userForm.controls['employeeCV'].updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }
  

  onPhotoSelected(event: any): void {
    const file = event.target.files[0] as File;
    this.selectedPhoto = file;
  
    if (file) {
      this.selectedPhotoName = file.name;
  
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Get Base64 part only
  
        // Update the form with the Base64 string
        this.userForm.controls['userProfile'].setValue(base64String);
        this.userForm.controls['userProfile'].markAsTouched();
        this.userForm.controls['userProfile'].updateValueAndValidity();
      };
  
      reader.readAsDataURL(file); // This triggers reader.onload
    } else {
      this.selectedPhotoName = '';
      this.userForm.controls['userProfile'].setValue(null);
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
      userProfile: formData.userProfile,
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
      employeeCV: formData.employeeCV,
      userStatus: formData.userStatus
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
      phoneNumber: formData.phoneNumber,
      idNumber: formData.idNumber,
      address: formData.address,
      userProfile: formData.userProfile,
      educationLevel: formData.educationLevel,
      universityName: formData.universityName,
      courseName: formData.courseName,
      // graduationYear: this.datePipe.transform(formData.graduationYear, 'dd-MM-yyyy'),
      courseClass: formData.courseClass,
      role: formData.role,
      department: formData.department,
      githubLink: formData.githubLink,
      portfolioLink: formData.portfolioLink,
      // startDate: this.datePipe.transform(formData.startDate, 'dd-MM-yyyy'),
      userStatus: formData.userStatus
    };

    // Remove empty fields (null, undefined, or empty string)
    Object.keys(userData).forEach(
      key => (userData[key] == null || userData[key] === '') && delete userData[key]
    );


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
    userData = { ...userData, privileges };
    console.log(userData)
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

  updateRoleBasedValidators(role: string) {
    const githubCtrl = this.userForm.get('githubLink');
    const portfolioCtrl = this.userForm.get('portfolioLink');

    githubCtrl?.clearValidators();
    portfolioCtrl?.clearValidators();

    if (role === 'Developer') {
      githubCtrl?.setValidators([Validators.required]);
      portfolioCtrl?.setValidators([Validators.required]);
    } else if (role === 'Designer') {
      portfolioCtrl?.setValidators([Validators.required]);
    }

    githubCtrl?.updateValueAndValidity();
    portfolioCtrl?.updateValueAndValidity();
  }
  
  parseDate(dateString: string): Date {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  passGration(dateString: string): Date {
    const parts = dateString.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
}


