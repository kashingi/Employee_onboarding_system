import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
[x: string]: any;
  user: any;
  profileImageUrl = '';

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser();
  }

  //get loggedIn user
  currentUser() {
    let userEmail = localStorage.getItem('loggedInEmail');
    this.ngxService.start();
    this.userService.getLoggedInUser(userEmail).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        console.log(resp);
        if (resp.length > 0) {
          this.user = resp[0];
          // prepend the proper data URI header
          this.profileImageUrl = `data:image/jpeg;base64,${this.user.userProfile}`;
        }
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
      }
    );
  }

  handleEditAction(values: any) {
    console.log(values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UpdateAccountComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        // this.getAllUsers();
      }
    );
  }
}
