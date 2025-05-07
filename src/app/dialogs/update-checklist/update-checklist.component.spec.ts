import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChecklistComponent } from './update-checklist.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { of } from 'rxjs';



describe('UpdateChecklistComponent', () => {
    let component: UpdateChecklistComponent;
    let fixture: ComponentFixture<UpdateChecklistComponent>;

    const mockDialogRef = {
        close: jest.fn(),
    };

    const mockDialogData = {
        action: 'Add',
        type: 'Admin',
        data: {
            id: 'someId',
            field: 'Test Requirement',
        },
    };

    const mockUserService = {
        addAdminRequirements: jest.fn().mockReturnValue(of({})),
        addDeveloperRequirements: jest.fn().mockReturnValue(of({})),
        addDesignerRequirements: jest.fn().mockReturnValue(of({})),
        addHRRequirements: jest.fn().mockReturnValue(of({})),
        updateAdminRequirements: jest.fn().mockReturnValue(of({})),
        updateDeveloperRequirements: jest.fn().mockReturnValue(of({})),
        updateDesignerRequirements: jest.fn().mockReturnValue(of({})),
        updateHRRequirements: jest.fn().mockReturnValue(of({})),
    };

    const mockNgxUiLoaderService = {
        start: jest.fn(),
        stop: jest.fn(),
    };

    const mockSnackbarService = {
        success: jest.fn(),
        danger: jest.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UpdateChecklistComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: UserService, useValue: mockUserService },
                { provide: NgxUiLoaderService, useValue: mockNgxUiLoaderService },
                { provide: SnackbarService, useValue: mockSnackbarService },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UpdateChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
