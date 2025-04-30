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
    MatTooltipModule
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
  element: any;

  constructor(
    private requirements: UserService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService
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
    this.requirements.getAdminRequirements().subscribe(
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
    this.requirements.getDeveloperRequirements().subscribe(
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
    this.requirements.getDesignerRequirements().subscribe(
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
    this.requirements.getHRRequirements().subscribe(
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


  //Add user here
  openAddDialog(type: 'Admin' | 'Developer' | 'Designer' | 'HR') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { type };
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
       }if (type === 'Designer') {
        this.getDesignerRequiremnts();
       } else if (type === 'HR') {
        this.getHrRequiremnts();
       }else{
        this.snackbar.warning("Select Role in to update requirement.", "X");
       }
      }
    );

  }
}
