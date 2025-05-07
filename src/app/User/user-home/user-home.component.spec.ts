import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomeComponent } from './user-home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENVIRONMENT } from '../../tokens/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserHomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserHomeComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: {
            baseUrl:       'http://localhost:3000/',
            production:    false,
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
