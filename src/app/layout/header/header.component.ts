import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { Router } from '@angular/router'
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { MatButtonModule } from '@angular/material/button'



@Component({
  selector: 'app-header',
  imports: [MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  constructor (
    private router: Router,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    
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
}
