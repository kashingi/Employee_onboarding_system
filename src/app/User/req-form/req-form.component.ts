import { Component, OnInit, Inject, output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { GolobalConstants } from '../../Shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-req-form',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './req-form.component.html',
  styleUrl: './req-form.component.scss'
})
export class ReqFormComponent implements OnInit{
  reqForm: any = FormGroup;
  onAddProduct = output();
  onEditProduct = output();
  dialogAction = 'Add';
  action = 'Add';
  responseMessage: any;

  fieldName = '';

  

  

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private reqService: UserService,
    public dialogRef: MatDialogRef<ReqFormComponent>,
    private snackbar: SnackbarService,
  ) {}

  

  ngOnInit(): void {

    this.fieldName   = this.dialogData.data;

    this.reqForm = this.formBuilder.group({
      requirement: ['', [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]]
    })
  }

  //add requirement here
  addRequirement() {
    if (this.reqForm.invalid) return;
    this.ngxService.start();
    
    let userId = this.reqService.user.id;
    const data = this.reqForm.value.requirement;
    const payload = { [this.fieldName]: data };

    
    
    
    let role = this.reqService.Role;
    let response;
    // switch (role) {
    //   case 'Admin':
    //     response = this.reqService.addAdminRequirements(payload);
    //     break;
    //   case 'Developer':
    //     response = this.reqService.addDeveloperRequirements(payload);
    //     break;
    //   case 'Designer':
    //     response = this.reqService.addDesignerRequirements(payload);
    //     break;
    //   case 'HR':
    //     response = this.reqService.addHRRequirements(payload);
    //     break;
    // }
    this.reqService.updateUser(userId, payload).subscribe({
      next: () => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.snackbar.success(this.fieldName + ' added successfully.', 'X');
        this.ngxService.stop();
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.danger('Could not save' + this.fieldName + ' try again later.', 'X');
        this.ngxService.stop();
        if (error.error?.error) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    });
  }
  
}
