import { Component, OnInit, signal } from '@angular/core';
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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';

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

  userForm: any = FormGroup;
  userId: any;

 
  profileImgUrl = signal<string>('');


  selectedPhoto: File | null = null;
  selectedPhotoName: string = '';

  constructor(
    public userService: UserService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userProfile: ['', [Validators.required]],
    });
    this.userService.currentUser();
  }

  

  handleEditAction(values: any) {
    console.log("User Values : " ,values);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
    };
    dialogConfig.width = '850px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UpdateAccountComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
      this.userService.currentUser();
    });

    const sub = dialogRef.componentInstance.onEditProduct.subscribe(
      (response) => {
        // this.getAllUsers();
      }
    );
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0] as File;
    this.selectedPhoto = file;
  
    if (file) {
      this.selectedPhotoName = file.name;
  
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
  
        // Update form control (if needed for later saving)
        this.userForm.controls['userProfile'].setValue(base64String);
        this.userForm.controls['userProfile'].markAsTouched();
        this.userForm.controls['userProfile'].updateValueAndValidity();
  
        // 👇 Update image preview immediately
        this.userService.profileImageUrl = reader.result as string;
      };
  
      reader.readAsDataURL(file);
    } else {
      this.selectedPhotoName = '';
      this.userForm.controls['userProfile'].setValue(null);
    }
  }

  //Update the newly selected photo
  updateProfilePhoto() {
    this.ngxService.start();
    let userProfile = this.userForm.value;

    this.userService.updatePhoto(this.userService.user.id, userProfile).subscribe(
      (resp: any)=>{
        this.ngxService.stop();
        console.log(resp);
        this.snackbar.success("Profile updated successfully.", "X");
        this.userForm.reset();
        this.userService.currentUser();
      },
      (error: any)=>{
        this.ngxService.stop();
        console.log(error);
        this.snackbar.danger("The ystem is busy, kindly try again later.", "X");
      }
    );
  }
  
}
