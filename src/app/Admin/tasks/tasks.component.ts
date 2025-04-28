import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { TaskFormComponent } from '../../dialogs/task-form/task-form.component';
import { GolobalConstants } from '../../Shared/global-constants';

//Added imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-tasks',
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'taskName',
    'invited',
    'assignedTo',
    'date',
    'status',
    'action',
  ];
  dataSource: any;
  responseMessage: any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  users: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private taskService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getAllTasks();
    this.getAllUsers();
  }

  //get all tasks from the database
  getAllTasks() {
    this.ngxService.start();
    this.taskService.getTasks().subscribe(
      (resp: any) => {
        this.ngxService.stop();
        console.log('Tasks: ', resp);
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
      }
    );
  }

  //get users to be assigned tasks
  getAllUsers() {
    this.ngxService.start();
    this.taskService.getUsers().subscribe(
      (resp: any) => {
        this.users = resp;
        console.log("All the Users: ", this.users)
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.Message) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    );
  }

  //handle add action here
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    console.log('Clicked : ');
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(TaskFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        this.getAllTasks();
      }
    );
  }

  //Handle edit action here
  handleEditAction(values: any) {
    console.log("Values: ", values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(TaskFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        this.getAllTasks();
      }
    );
  }

  //Handle delete action here
  //HAndle delete user action
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete task ' + values.taskName,
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteTask(values.id);
        dialogRef.close();
      }
    );
  }

  //Implement Delete user
  deleteTask(id: any) {
    this.taskService.deleteTask(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.getAllTasks();
        this.snackbar.success('User deleted successfully.', 'X');
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
        if (error.error?.Message) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
      }
    );
  }

  //apply filter here
  applyfilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
