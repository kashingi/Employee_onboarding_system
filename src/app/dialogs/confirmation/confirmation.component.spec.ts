import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

describe('ConfirmationComponent', () => {
    let component: ConfirmationComponent;
    let fixture: ComponentFixture<ConfirmationComponent>;

    const mockDialogRef = {
        close: jest.fn(),
    };

    const mockDialogData = {
        message: 'Are you sure?',
        confirmation: true,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ConfirmationComponent,
                MatDialogModule
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
