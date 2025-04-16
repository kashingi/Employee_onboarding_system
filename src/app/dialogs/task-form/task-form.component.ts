import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GolobalConstants } from '../../Shared/global-constants';

//Added imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-task-form',
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
  providers: [DatePipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  taskForm: any = FormGroup;
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;

  statuses = [{ name: 'Pending' }, { name: 'Completed' }];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    private snackbar: SnackbarService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      taskName: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.nameRegex)],
      ],
      invited: [null, [Validators.required]],
      date: [null, [Validators.required]],
      status: [
        null,
        [Validators.required, Validators.pattern(GolobalConstants.nameRegex)],
      ],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.taskForm.patchValue(this.dialogData.data);
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
    var formData = this.taskForm.value;
    var taskData = {
      taskName: formData.taskName,
      invited: formData.invited,
      date: this.datePipe.transform(formData.date, 'dd-MM-yyyy'),
      status: formData.status,
    };

    console.log(taskData);
    this.userService.addTasks(taskData).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.ngxService.stop();
        this.onAddProduct.emit();
        this.snackbar.success('Task added successfully.', 'X');
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
    var taskId = this.dialogData.data.id;
    var formData = this.taskForm.value;
    var updateData = {
      taskName: formData.taskName,
      invited: formData.invited,
      date: this.datePipe.transform(formData.date, 'dd-MM-yyyy'),
      status: formData.status,
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
