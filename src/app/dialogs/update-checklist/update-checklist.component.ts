import { Component, OnInit, Inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, ReactiveFormsModule, FormsModule, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { GolobalConstants } from '../../Shared/global-constants';

@Component({
  selector: 'app-update-checklist',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './update-checklist.component.html',
  styleUrl: './update-checklist.component.scss'
})
export class UpdateChecklistComponent implements OnInit {
  addForm: any = FormGroup;

  onAddProduct = output();
  onEditProduct = output();
  dialogAction = 'Add';
  action = 'Add';
  responseMessage: any;

  statuses = [
    { name: 'Pending' },
    { name: 'Completed' }
  ];

  type = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private checklistService: UserService,
    public dialogRef: MatDialogRef<UpdateChecklistComponent>,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      requirement: ['', [Validators.required, Validators.pattern(GolobalConstants.nameRegex)]]
    });

    this.type = this.dialogData.type;
    if (this.dialogData.action === 'Edit' && this.dialogData.data) {
      const requirement = this.dialogData.data.field;
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.addForm.patchValue({ requirement: requirement});

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
    const field = this.addForm.value.requirement;
    const payload = { field };

    // pick correct service call:
    console.log("Field : ", field)
    let response;
    switch (this.dialogData.type) {
      case 'Admin':
        response = this.checklistService.addAdminRequirements(payload);
        break;
      case 'Developer':
        response = this.checklistService.addDeveloperRequirements(payload);
        break;
      case 'Designer':
        response = this.checklistService.addDesignerRequirements(payload);
        break;
      case 'HR':
        response = this.checklistService.addHRRequirements(payload);
        break;
    }

    response!.subscribe({
      next: () => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.snackbar.success(field + ' added successfully.', 'X');
        this.ngxService.stop();
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.danger('Could not save' + field + ' try again later.', 'X');
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


  edit() {
    let taskId = this.dialogData.data.id;
    // let formData = this.addForm.value;
    // let updateData = {
    //   taskName: formData.taskName,
    //   invited: formData.invited,
    //   status: formData.status,
    // };
    // console.log(taskId, updateData);
    let reqId = this.dialogData.data.id;
    const field = this.addForm.value.requirement;
    const payload = { field };

    // pick correct service call:
    console.log("Field : ", field, reqId)
    let response;
    switch (this.dialogData.type) {
      case 'Admin':
        response = this.checklistService.updateAdminRequirements(reqId, payload);
        break;
      case 'Developer':
        response = this.checklistService.updateDeveloperRequirements(reqId ,payload);
        break;
      case 'Designer':
        response = this.checklistService.updateDesignerRequirements(reqId ,payload);
        break;
      case 'HR':
        response = this.checklistService.updateHRRequirements(reqId, payload);
        break;
    }

    response!.subscribe({
      next: () => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.snackbar.success(field + ' updated successfully.', 'X');
        this.ngxService.stop();
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.danger('Could not save' + field + ' try again later.', 'X');
        this.ngxService.stop();
        if (error.error?.error) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    });


  //   this.checklistService.updateTask(taskId, updateData).subscribe(
  //     {
  //       next: (response: any) => {
  //         this.dialogRef.close();
  //         this.onEditProduct.emit();
  //         this.responseMessage = response.Message;
  //         this.snackbar.success('Task updated successfully.', 'X');
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         if (error.error?.error) {
  //           this.responseMessage = error.error?.Message;
  //         } else {
  //           this.responseMessage = GolobalConstants.genericError;
  //         }
  //         this.snackbar.danger(this.responseMessage, GolobalConstants.error);
  //       }
  //     }
  //   );



  }
}
