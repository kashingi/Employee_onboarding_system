import { Component, OnInit, TemplateRef } from '@angular/core';

//Added inports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { UpdateChecklistComponent } from '../../dialogs/update-checklist/update-checklist.component';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GolobalConstants } from '../../Shared/global-constants';

@Component({
  selector: 'app-checklist',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent implements OnInit {

  addForm: any = FormGroup;
  adminRequirements: any[] = [];
  devRequirements: any[] = [];
  designerRequirements: any[] = [];
  hrRequirements: any[] = [];
  responseMessage = '';

  typeOfUser: 'admin' | 'developer' | 'designer' | 'hr' | undefined;
  itemToBeDeleted: { id: string; field: string; } | undefined

  constructor(
    private reqService: UserService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      requirement: ['', Validators.required]
    });
    this.getAdminrequiremnts();
    this.getDevRequiremnts();
    this.getDesignerRequiremnts();
    this.getHrRequiremnts();
  }

  //get common user onboarding requirements from the database
  getAdminrequiremnts() {
    this.reqService.getAdminRequirements().subscribe(
      {
        next: (resp: any) => {
          console.log("Admin requirements : ", resp);
          this.adminRequirements = resp;
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }

  //get developer requirements
  getDevRequiremnts() {
    this.reqService.getDeveloperRequirements().subscribe(
      {
        next: (resp: any) => {
          console.log("Dev requirements : ", resp);
          this.devRequirements = resp;
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }

  //get designer requirements
  getDesignerRequiremnts() {
    this.reqService.getDesignerRequirements().subscribe(
      {
        next: (resp: any) => {
          console.log("Designer requirements : ", resp);
          this.designerRequirements = resp;
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }

  //get HR requirements
  getHrRequiremnts() {
    this.reqService.getHRRequirements().subscribe(
      {
        next: (resp: any) => {
          console.log("HR requirements : ", resp);
          this.hrRequirements = resp;
        },
        error: (error: any) => {
          console.log(error)
        }
      }
    );
  }


  //Add requirement here
  openAddDialog(type: 'Admin' | 'Developer' | 'Designer' | 'HR') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      type,
      action: 'Add'
    };
    dialogConfig.width = '360px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UpdateChecklistComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        if (type === 'Admin') {
          this.getAdminrequiremnts();
        } else if (type === 'Developer') {
          this.getDevRequiremnts();
        } if (type === 'Designer') {
          this.getDesignerRequiremnts();
        } else if (type === 'HR') {
          this.getHrRequiremnts();
        } else {
          this.snackbar.warning("Select Role in to update requirement.", "X");
        }
      }
    );

  }

  //Edit requirement here
  openEditDialog(type: 'Admin' | 'Developer' | 'Designer' | 'HR', requirement: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: requirement,
      type,
      action: 'Edit'
    };
    dialogConfig.width = '340px';
    dialogConfig.enterAnimationDuration = '300ms';
    const dialogRef = this.dialog.open(UpdateChecklistComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddProduct.subscribe(
      (response) => {
        if (type === 'Admin') {
          this.getAdminrequiremnts();
        } else if (type === 'Developer') {
          this.getDevRequiremnts();
        } if (type === 'Designer') {
          this.getDesignerRequiremnts();
        } else if (type === 'HR') {
          this.getHrRequiremnts();
        } else {
          this.snackbar.warning("Select Role in to update requirement.", "X");
        }
      }
    );

  }

  //HAndle delete user action
  handleDeleteAction(type: 'Admin' | 'Developer' | 'Designer' | 'HR', requirement: any) {
    console.log("Id is : ", requirement.id)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' delete ' + requirement.field,
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response) => {
        this.ngxService.start();
        this.deleteRequirement(type, requirement.id);
        dialogRef.close();
      }
    );
  }

  //Implement Delete user
  deleteRequirement(type: string, id: string) {
    console.log("Delete Id is : ", id);
    let response;
    switch (type) {
      case 'Admin':
        response = this.reqService.deleteAdminRequirements(id);
        break;

      case 'Developer':
        response = this.reqService.deleteDeveloperRequirements(id);
        break;

      case 'Designer':
        response = this.reqService.deleteDesignerRequirements(id)
        break;

      case 'HR':
        response = this.reqService.deleteHRRequirements(id);
        break;

      default:
        this.ngxService.stop();
        this.snackbar.warning("Please specify role to delete requirement.", "X");
        return;

    }

    response.subscribe(
      {
        next: (resp: any)=>{
          this.ngxService.stop();
          if (type === 'Admin') {
            this.getAdminrequiremnts();
          } else if (type === 'Developer') {
            this.getDevRequiremnts();
          }else if (type === 'Designer') {
            this.getDesignerRequiremnts();
          }else if (type === 'HR') {
            this.getHrRequiremnts();
          
            
          }
          this.snackbar.success('Requirement deleted successfully.', 'X');
        },
        error: (error: any)=>{
          this.ngxService.stop();
        console.log(error);
        if (error.error?.Message) {
          this.responseMessage = error.error?.Message;
        } else {
          this.responseMessage = GolobalConstants.genericError;
        }
        this.snackbar.danger(this.responseMessage, GolobalConstants.error);
        }
      }
    );
    // this.requirements.deleteUser(id).subscribe(
    //   (response: any) => {
    //     this.ngxService.stop();

    //     this.snackbar.success('User deleted successfully.', 'X');
    //   },
    //   (error: any) => {
    //     this.ngxService.stop();
    //     console.log(error);
    //     if (error.error?.Message) {
    //       this.responseMessage = error.error?.Message;
    //     } else {
    //       this.responseMessage = GolobalConstants.genericError;
    //     }
    //     this.snackbar.danger(this.responseMessage, GolobalConstants.error);
    //   }
    // );
  }
}
