import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatNativeDateModule } from '@angular/material/core';

describe('TaskFormComponent', () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;

    const mockRequirementService = {
        getRequirements: jest.fn().mockReturnValue(of([])),
      };

    const mockDialogRef = { close: jest.fn() };
    const mockLoader = {
        start: jest.fn(),
        stop: jest.fn()
    };
    const mockUserService = {
        getUsers: jest.fn().mockReturnValue(of([])),
        addTasks: jest.fn().mockReturnValue(of({})),
        updateTask: jest.fn().mockReturnValue(of({}))
    };
    const mockSnackbar = {
        success: jest.fn(),
        danger: jest.fn()
    };
    const dialogData = { action: 'Add', data: {} };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TaskFormComponent,
                MatNativeDateModule
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: NgxUiLoaderService, useValue: mockLoader },
                { provide: UserService, useValue: mockUserService },
                { provide: SnackbarService, useValue: mockSnackbar },
                { provide: mockRequirementService, useValue: mockRequirementService },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TaskFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
