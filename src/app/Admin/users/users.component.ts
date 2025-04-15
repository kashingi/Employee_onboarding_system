import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GolobalConstants } from '../../Shared/global-constants';
import { UserFormComponent } from '../../dialogs/user-form/user-form.component';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';

//Imported modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status'];
  dataSource: any;
  responseMessage: any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbar: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  //call get all users function from users service
  getAllUsers() {
    this.ngxService.start();
    this.userService.getUsers().subscribe(
      (resp: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
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

  //Add user here
  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    console.log('Clicked : ');
    dialogConfig.data = {
      action: 'Add',
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UserFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        this.getAllUsers();
      }
    );
  }

  //Handle edit user here
  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UserFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        this.getAllUsers();
      }
    );
  }

  //HAndle delete user action
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete user ' + values.name,
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteUser(values.id);
        dialogRef.close();
      }
    );
  }

  //Implement Delete user
  deleteUser(id: any) {
    this.userService.deleteUser(id).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.getAllUsers();
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
