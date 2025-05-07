import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksComponent } from './tasks.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';

describe('TasksComponent', () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;

    const mockLoader = {
        start: jest.fn(),
        stop: jest.fn()
    };
    const mockUserService = {
        getTasks: jest.fn().mockReturnValue(of([])),
        getUsers: jest.fn().mockReturnValue(of([]))
    };
    const mockSnackbar = {
        success: jest.fn(),
        danger: jest.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TasksComponent,
                HttpClientTestingModule
            ],
            providers: [
                { provide: NgxUiLoaderService, useValue: mockLoader },
                { provide: UserService, useValue: mockUserService },
                { provide: SnackbarService, useValue: mockSnackbar }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
