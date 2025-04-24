import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  Injectable,
} from '@angular/core';
import {
  MatDialogConfig,
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { GolobalConstants } from '../global-constants';
import { MatStepperModule, MatStepperIntl } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';

@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional"
  override optionalLabel = 'Optional Label';
}

@Component({
  selector: 'app-update-account',
  providers: [
    {
      provide: MatStepperIntl,
      useClass: StepperIntl,
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    DatePipe,
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
    MatProgressBarModule,
  ],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.scss',
})
export class UpdateAccountComponent implements OnInit {
  updateForm: any = FormGroup;
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
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
    { name: 'Certificate' },
  ];

  classes = [
    { name: 'Honors First Class' },
    { name: 'Honors Second Class' },
    { name: 'Second Class Lower' },
    { name: 'Pass' },
  ];

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<UpdateAccountComponent>
  ) { }

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
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
      role: [{ value: this.dialogData.data.role, disabled: false }],
      department: [null, [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]],
      githubLink: [null, [Validators.required]],
      portfolioLink: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      employeeCV: [null, [Validators.required]],

      //Admin to modify
      //userStatus: ['Inactive'],
    });

    // Parse the date string into a real Date object
    const parsedDate = this.parseDate(this.dialogData.data.startDate);
    const passGraduation = this.passGration(this.dialogData.data.graduationYear);

    // Watch role change
    this.updateForm.patchValue({
      ...this.dialogData.data,
      startDate: parsedDate,
      graduationYear: passGraduation
    });

    // this.getUserRoles();
  }


  onCVSelected(event: any): void {
    const file = event.target.files[0] as File;
    this.selectedCV = file;

    if (file) {
      this.selectedCVName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];

        // Update the form with the Base64 string
        this.updateForm.controls['employeeCV'].setValue(base64String);
        this.updateForm.controls['employeeCV'].markAsTouched();
        this.updateForm.controls['employeeCV'].updateValueAndValidity();
      };

      reader.readAsDataURL(file);
    } else {
      this.selectedCVName = '';
      this.updateForm.controls['employeeCV'].setValue(null);
    }
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
        this.updateForm.controls['userProfile'].setValue(base64String);
        this.updateForm.controls['userProfile'].markAsTouched();
        this.updateForm.controls['userProfile'].updateValueAndValidity();
      };

      reader.readAsDataURL(file); // This triggers reader.onload
    } else {
      this.selectedPhotoName = '';
      this.updateForm.controls['userProfile'].setValue(null);
    }
  }
  //get all available role
  // getUserRoles() {
  //   this.userService.getRoles().subscribe(
  //     (resp: any) => {
  //       console.log(resp);
  //       this.roles = resp;
  //     },
  //     (error: any) => {
  //       console.log(error);
  //     }
  //   );
  // }

  handleSubmit() {
    var userEmail = this.dialogData.data.email;
    var formData = this.updateForm.value;
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
      graduationYear: this.datePipe.transform(formData.graduationYear, 'dd-MM-yyyy'),
      courseClass: formData.courseClass,
     // role: formData.role,
      department: formData.department,
      githubLink: formData.githubLink,
      portfolioLink: formData.portfolioLink,
      startDate: this.datePipe.transform(formData.startDate, 'dd-MM-yyyy'),
      employeeCV: formData.employeeCV,
      //userStatus: formData.userStatus,
    };

    console.log(userEmail,userData);
    this.userService.updateUserByEmail(userEmail, userData).subscribe(
      (response: any) => {
        console.log(response)
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
