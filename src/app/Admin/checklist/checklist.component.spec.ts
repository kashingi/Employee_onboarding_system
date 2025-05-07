import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistComponent } from './checklist.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

describe('ChecklistComponent', () => {
    let component: ChecklistComponent;
    let fixture: ComponentFixture<ChecklistComponent>;

    const mockUserService = {
        getAdminRequirements: jest.fn().mockReturnValue(of([])),
        getDeveloperRequirements: jest.fn().mockReturnValue(of([])),
        getDesignerRequirements: jest.fn().mockReturnValue(of([])),
        getHRRequirements: jest.fn().mockReturnValue(of([])),
        deleteAdminRequirements: jest.fn().mockReturnValue(of({})),
        deleteDeveloperRequirements: jest.fn().mockReturnValue(of({})),
        deleteDesignerRequirements: jest.fn().mockReturnValue(of({})),
        deleteHRRequirements: jest.fn().mockReturnValue(of({})),
    };

    const mockDialog = {
        open: jest.fn().mockReturnValue({
            afterClosed: jest.fn().mockReturnValue(of(true)),
            componentInstance: {}
        }),
    };

    const mockRouter = {
        events: of({}),
    };

    const mockSnackbarService = {
        success: jest.fn(),
        warning: jest.fn(),
        danger: jest.fn(),
    };

    const mockNgxUiLoaderService = {
        start: jest.fn(),
        stop: jest.fn(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ChecklistComponent,
                HttpClientTestingModule
            ],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: MatDialog, useValue: mockDialog },
                { provide: Router, useValue: mockRouter },
                { provide: SnackbarService, useValue: mockSnackbarService },
                { provide: NgxUiLoaderService, useValue: mockNgxUiLoaderService },
              ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChecklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
