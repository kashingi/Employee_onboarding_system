import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-header',
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  user: any;
  profileImageUrl = '';

  constructor (
    private router: Router,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.currentUser();
  }
  //Open or navigate to your account
  openAccount() {
    this.router.navigate(['admin/home/account'])
  }

  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
      this.snackbar.success("You logged out successfully.", "X")
    })
  }  

  //get loggedIn user
  currentUser() {
    let userEmail = localStorage.getItem('loggedInEmail');
    console
    this.ngxService.start();
    this.userService.getLoggedInUser(userEmail).subscribe(
      (resp: any) => {
        this.ngxService.stop();
        if (resp.length > 0) {
          this.user = resp[0];
          this.profileImageUrl = `data:image/jpeg;base64,${this.user.userProfile}`;
        }
      },
      (error: any) => {
        this.ngxService.stop();
        console.log(error);
      }
    );
  }
}
